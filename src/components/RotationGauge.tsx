"use client";

import React from "react";

interface RotationGaugeProps {
  /** 다음 90도 회전까지 남은 이동 횟수 */
  remainingMoves: number;
  /** 전체 회전 주기 (기본값: 100) */
  totalInterval?: number;
}

/**
 * 100턴 회전 카운트다운 게이지 바 컴포넌트
 * 플레이어에게 90도 시계방향 회전까지 남은 이동 수를 시각적으로 경고합니다.
 * 남은 횟수가 10회 이하로 떨어지면 위험 경고(펄스 효과 및 붉은색)를 활성화합니다.
 */
export const RotationGauge: React.FC<RotationGaugeProps> = ({
  remainingMoves,
  totalInterval = 100,
}) => {
  // 진행률 계산 (0% -> 100%)
  const elapsed = totalInterval - remainingMoves;
  const progressPercent = Math.round(Math.min(100, Math.max(0, (elapsed / totalInterval) * 100)));

  // 10회 이하 임계 도달 시 위험 상태 활성화
  const isImminent = remainingMoves <= 10;

  return (
    <div
      className={`w-full max-w-sm mx-auto bg-slate-900/90 border rounded-xl p-2.5 sm:p-3 transition-colors duration-300 shadow-lg ${
        isImminent
          ? "border-rose-500/80 shadow-rose-950/40 animate-pulse"
          : "border-slate-800 shadow-black/40"
      }`}
    >
      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="text-sm">⚠️</span>
          <span className="tracking-wide">90° 회전까지</span>
        </span>
        <span
          className={`font-mono text-xs px-2 py-0.5 rounded ${
            isImminent ? "bg-rose-950 text-rose-300 font-bold" : "text-slate-300 bg-slate-800"
          }`}
        >
          {remainingMoves}회 남음
        </span>
      </div>

      {/* 진행 바 컨테이너 */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className="gauge-progress-bar h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-sky-500 via-amber-500 to-rose-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
