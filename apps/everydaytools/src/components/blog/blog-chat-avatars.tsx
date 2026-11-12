import React, { useId } from "react";

export const BORING_BEAM_COLORS = [
  "#723e4e",
  "#b03851",
  "#ef3353",
  "#f17144",
  "#f4b036",
];

const SIZE = 36;

function hashCode(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getDigit(number: number, ntn: number): number {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
}

function getBoolean(number: number, ntn: number): boolean {
  return !(getDigit(number, ntn) % 2);
}

function getUnit(number: number, range: number, index?: number): number {
  const value = number % range;
  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  }
  return value;
}

function getRandomColor(number: number, colors: string[], range: number): string {
  return colors[number % range] || colors[0];
}

interface BeamData {
  wrapperColor: string;
  faceColor: string;
  backgroundColor: string;
  wrapperTranslateX: number;
  wrapperTranslateY: number;
  wrapperRotate: number;
  wrapperScale: number;
  isMouthOpen: boolean;
  isCircle: boolean;
  eyeSpread: number;
  mouthSpread: number;
  faceRotate: number;
  faceTranslateX: number;
  faceTranslateY: number;
}

function getBeamData(name: string, colors: string[]): BeamData {
  const numFromName = hashCode(name);
  const range = colors.length;
  const wrapperColor = getRandomColor(numFromName, colors, range);
  const preTranslateX = getUnit(numFromName, 10, 1);
  const wrapperTranslateX =
    preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
  const preTranslateY = getUnit(numFromName, 10, 2);
  const wrapperTranslateY =
    preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

  return {
    wrapperColor,
    faceColor: "#FFFFFF", // Harmonized pure white for all avatars
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX,
    wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    isCircle: getBoolean(numFromName, 1),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX:
      wrapperTranslateX > SIZE / 6
        ? wrapperTranslateX / 2
        : getUnit(numFromName, 8, 1),
    faceTranslateY:
      wrapperTranslateY > SIZE / 6
        ? wrapperTranslateY / 2
        : getUnit(numFromName, 7, 2),
  };
}

export function HarmonizedBeamAvatar({
  name,
  colors = BORING_BEAM_COLORS,
  size = 32,
  className = "",
}: {
  name: string;
  colors?: string[];
  size?: number;
  className?: string;
}): React.JSX.Element {
  const maskId = useId();
  const data = getBeamData(name, colors);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={SIZE * 2} fill="#FFFFFF" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect width={SIZE} height={SIZE} fill={data.backgroundColor} />
        <rect
          x={0}
          y={0}
          width={SIZE}
          height={SIZE}
          transform={`translate(${data.wrapperTranslateX} ${data.wrapperTranslateY}) rotate(${data.wrapperRotate} ${SIZE / 2} ${SIZE / 2}) scale(${data.wrapperScale})`}
          fill={data.wrapperColor}
          rx={data.isCircle ? SIZE : SIZE / 6}
        />
        <g
          transform={`translate(${data.faceTranslateX} ${data.faceTranslateY}) rotate(${data.faceRotate} ${SIZE / 2} ${SIZE / 2})`}
        >
          {data.isMouthOpen ? (
            <path
              d={`M15 ${19 + data.mouthSpread}c2 1 4 1 6 0`}
              stroke={data.faceColor}
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d={`M13,${19 + data.mouthSpread} a1,0.75 0 0,0 10,0`}
              fill={data.faceColor}
            />
          )}
          <rect
            x={14 - data.eyeSpread}
            y={14}
            width={1.5}
            height={2}
            rx={1}
            stroke="none"
            fill={data.faceColor}
          />
          <rect
            x={20 + data.eyeSpread}
            y={14}
            width={1.5}
            height={2}
            rx={1}
            stroke="none"
            fill={data.faceColor}
          />
        </g>
      </g>
    </svg>
  );
}

export interface ChatAvatarProps {
  name?: string;
  className?: string;
  size?: number;
}

export function UserChatAvatar({
  name = "User Question",
  className = "",
  size = 32,
}: ChatAvatarProps = {}): React.JSX.Element {
  return (
    <div
      data-testid="user-chat-avatar"
      className={`size-8 shrink-0 mt-0.5 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center shadow-xs select-none ${className}`.trim()}
      aria-hidden="true"
    >
      <HarmonizedBeamAvatar
        size={size}
        name={name}
        colors={BORING_BEAM_COLORS}
      />
    </div>
  );
}

export function AssistantChatAvatar({
  name = "EverydayTools Assistant",
  className = "",
  size = 32,
}: ChatAvatarProps = {}): React.JSX.Element {
  return (
    <div
      data-testid="assistant-chat-avatar"
      className={`size-8 shrink-0 mt-0.5 rounded-full overflow-hidden ring-1 ring-[var(--accent)]/40 flex items-center justify-center shadow-xs select-none ${className}`.trim()}
      aria-hidden="true"
    >
      <HarmonizedBeamAvatar
        size={size}
        name={name}
        colors={BORING_BEAM_COLORS}
      />
    </div>
  );
}
