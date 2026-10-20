import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

describe("Codebase Sanitation Rules", () => {
  it("ensures no Replit configuration files exist in the repository root", () => {
    const replitFiles = [".replit", ".replitignore", "replit.md", "replit.nix"];
    for (const file of replitFiles) {
      assert.strictEqual(
        fs.existsSync(path.join(rootDir, file)),
        false,
        `Expected ${file} to not exist in repository root`
      );
    }
  });

  it("ensures no tests.txt dump exists in the root directory", () => {
    assert.strictEqual(
      fs.existsSync(path.join(rootDir, "tests.txt")),
      false,
      "Expected tests.txt to not exist in repository root"
    );
  });

  it("ensures no duplicate apps/api-server/python directory exists", () => {
    assert.strictEqual(
      fs.existsSync(path.join(rootDir, "apps", "api-server", "python")),
      false,
      "Expected apps/api-server/python to not exist (canonical is apps/api-server/src/python)"
    );
  });

  it("ensures pnpm-workspace.yaml does not contain @replit exclusions", () => {
    const workspaceYaml = fs.readFileSync(path.join(rootDir, "pnpm-workspace.yaml"), "utf8");
    assert.strictEqual(workspaceYaml.includes("@replit/*"), false);
  });

  it("ensures no un-dotted duplicate agent directory exists", () => {
    assert.strictEqual(
      fs.existsSync(path.join(rootDir, "agent")),
      false,
      "Expected agent directory to not exist (canonical is .agents)"
    );
  });

  it("ensures no .replit-artifact directories exist in apps", () => {
    assert.strictEqual(
      fs.existsSync(path.join(rootDir, "apps", "api-server", ".replit-artifact")),
      false
    );
    assert.strictEqual(
      fs.existsSync(path.join(rootDir, "apps", "everydaytools", ".replit-artifact")),
      false
    );
  });
});
