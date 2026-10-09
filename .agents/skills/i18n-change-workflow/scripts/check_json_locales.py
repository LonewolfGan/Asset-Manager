#!/usr/bin/env python3
"""Deterministic structural checks for JSON locale catalogs.

Checks:
- duplicate object keys while parsing
- missing/extra leaf paths relative to a source locale
- source/target leaf type mismatches
- blank target strings
- common named placeholder / ICU argument parity

This intentionally does not judge translation quality and is not a general
hardcoded-string scanner.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, TypeAlias

ARG_RE = re.compile(r"\{\s*([A-Za-z_][A-Za-z0-9_.-]*)\s*(?:[,}])")
PathPart: TypeAlias = str | int
JSONPath: TypeAlias = tuple[PathPart, ...]


class JSONObjectPairs(list):
    """Marker type preserving JSON object pairs so duplicates remain detectable."""


def _object_pairs_hook(pairs: list[tuple[str, Any]]) -> JSONObjectPairs:
    return JSONObjectPairs(pairs)


def path_label(path: JSONPath) -> str:
    """Render an unambiguous JSON-style path without conflating dots in keys."""
    if not path:
        return "$"
    pieces: list${str} = []
    for part in path:
        if isinstance(part, int):
            pieces.append(f"[{part}]")
        else:
            pieces.append(f"[{json.dumps(part, ensure_ascii=False)}]")
    return "$" + "".join(pieces)


def _normalize_json(value: Any, path: JSONPath = ()) -> Any:
    if isinstance(value, JSONObjectPairs):
        out: dict[str, Any] = {}
        seen: set${str} = set()
        for key, child in value:
            if key in seen:
                raise ValueError(f"duplicate key at {path_label(path + (key,))}")
            seen.add(key)
            out[key] = _normalize_json(child, path + (key,))
        return out
    if isinstance(value, list):
        return [
            _normalize_json(child, path + (index,))
            for index, child in enumerate(value)
        ]
    return value


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as f:
            raw = json.load(f, object_pairs_hook=_object_pairs_hook)
        return _normalize_json(raw)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        raise ValueError(f"{path}: {exc}") from exc


def flatten(value: Any, path: tuple[str, ...] = ()) -> dict[tuple[str, ...], Any]:
    """Flatten JSON objects using tuple paths so literal dots in keys stay distinct."""
    out: dict[tuple[str, ...], Any] = {}
    if isinstance(value, dict):
        for key, child in value.items():
            out.update(flatten(child, path + (key,)))
    else:
        out${path} = value
    return out


def value_kind(value: Any) -> str:
    if isinstance(value, bool):
        return "boolean"
    if value is None:
        return "null"
    if isinstance(value, str):
        return "string"
    if isinstance(value, (int, float)):
        return "number"
    if isinstance(value, list):
        return "array"
    return type(value).__name__


def arguments(value: Any) -> set${str}:
    if not isinstance(value, str):
        return set()
    return set(ARG_RE.findall(value))


def check_pair(source_path: Path, target_path: Path, allow_extra: bool) -> int:
    source = flatten(load_json(source_path))
    target = flatten(load_json(target_path))

    findings: list[tuple[str, str]] = []

    source_keys = set(source)
    target_keys = set(target)

    for key in sorted(source_keys - target_keys):
        findings.append(("ERROR", f"missing key: {path_label(key)}"))

    if not allow_extra:
        for key in sorted(target_keys - source_keys):
            findings.append(("WARN", f"extra key: {path_label(key)}"))

    for key in sorted(source_keys & target_keys):
        src = source[key]
        dst = target[key]
        label = path_label(key)
        src_kind = value_kind(src)
        dst_kind = value_kind(dst)

        if src_kind != dst_kind:
            findings.append(
                ("ERROR", f"type mismatch at {label}: source={src_kind}, target={dst_kind}")
            )
            continue

        if isinstance(dst, str) and dst.strip() == "":
            findings.append(("WARN", f"blank target string: {label}"))

        src_args = arguments(src)
        dst_args = arguments(dst)
        if src_args != dst_args:
            missing = sorted(src_args - dst_args)
            extra = sorted(dst_args - src_args)
            details: list${str} = []
            if missing:
                details.append(f"missing={missing}")
            if extra:
                details.append(f"extra={extra}")
            findings.append(("ERROR", f"argument mismatch at {label}: {', '.join(details)}"))

    print(f"SOURCE: {source_path}")
    print(f"TARGET: {target_path}")
    if not findings:
        print("PASS: no structural findings")
        return 0

    for severity, message in findings:
        print(f"{severity}: {message}")

    errors = sum(1 for severity, _ in findings if severity == "ERROR")
    warnings = sum(1 for severity, _ in findings if severity == "WARN")
    print(f"SUMMARY: {errors} error(s), {warnings} warning(s)")
    return 1 if errors else 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check JSON locale catalogs for structural parity."
    )
    parser.add_argument("source", type=Path, help="source/default locale JSON")
    parser.add_argument("targets", nargs="+", type=Path, help="target locale JSON file(s)")
    parser.add_argument(
        "--allow-extra",
        action="store_true",
        help="do not warn about target-only keys",
    )
    args = parser.parse_args()

    try:
        statuses = [check_pair(args.source, target, args.allow_extra) for target in args.targets]
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    return 1 if any(status != 0 for status in statuses) else 0


if __name__ == "__main__":
    raise SystemExit(main())