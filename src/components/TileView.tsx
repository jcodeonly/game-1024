"use client";

import React from "react";
import { Tile } from "@/game/Tile";

interface TileViewProps {
  /** 렌더링할 타일 객체 */
  tile: Tile;
  /** 보드 회전 각도 (타일 내부 숫자를 정방향으로 보정하기 위해 사용) */
  boardRotationDegree: number;
}

/**
 * 타일 숫자별 Tailwind 색상 및 스타일 맵핑 함수
 */
function getTileStyle(value: number): string {
  switch (value) {
    case 2:
      return "bg-slate-700 text-slate-200 border-slate-600";
    case 4:
      return "bg-slate-600 text-slate-100 border-slate-500";
    case 8:
      return "bg-amber-700 text-amber-50 border-amber-600";
    case 16:
      return "bg-amber-600 text-white border-amber-500";
    case 32:
      return "bg-orange-600 text-white border-orange-500";
    case 64:
      return "bg-rose-600 text-white border-rose-500";
    case 128:
      return "bg-yellow-500 text-slate-900 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
    case 256:
      return "bg-sky-500 text-white border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.4)]";
    case 512:
      return "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]";
    case 1024:
      return "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_22px_rgba(245,158,11,0.8)]";
    default:
      return "bg-emerald-600 text-white border-emerald-500";
  }
}

/**
 * 타일 숫자 길이에 따른 폰트 크기 반환 함수
 */
function getFontSize(value: number): string {
  if (value >= 1024) return "text-sm sm:text-base md:text-lg font-black tracking-tight";
  if (value >= 128) return "text-base sm:text-lg md:text-xl font-extrabold";
  return "text-lg sm:text-xl md:text-2xl font-bold";
}

/**
 * 개별 타일 컴포넌트
 * 부드러운 위치 이동(Transition)과 90도 회전 시 텍스트 역회전(정방향 보정)을 처리합니다.
 */
export const TileView: React.FC<TileViewProps> = ({ tile, boardRotationDegree }) => {
  // 타일 위치를 백분율(4x4 기준 칸당 25%)로 계산
  const topPercent = tile.row * 25;
  const leftPercent = tile.col * 25;

  // 100턴 기믹: 보드가 회전하더라도 사용자가 숫자를 정상적으로 읽을 수 있도록
  // 보드 회전 각도의 역방향(-boardRotationDegree)으로 텍스트를 회전 보정
  const counterRotationStyle = {
    transform: `rotate(-${boardRotationDegree}deg)`,
    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const tileStyle = getTileStyle(tile.value);
  const fontSize = getFontSize(tile.value);

  return (
    <div
      className="absolute w-1/4 h-1/4 p-1 sm:p-1.5 transition-all duration-150 ease-out z-10"
      style={{
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
      }}
    >
      <div
        className={`w-full h-full rounded-lg sm:rounded-xl border flex items-center justify-center select-none shadow-sm ${tileStyle} ${
          tile.isMerged ? "animate-merge" : tile.isNew ? "animate-pop-in" : ""
        }`}
      >
        <span
          className={`tile-number inline-block ${fontSize}`}
          style={counterRotationStyle}
        >
          {tile.value}
        </span>
      </div>
    </div>
  );
};
