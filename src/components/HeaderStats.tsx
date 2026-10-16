"use client";

import React from "react";

interface HeaderStatsProps {
  /** 현재 진행 중인 게임의 이동 횟수 */
  moves: number;
  /** 로컬스토리지에 저장된 역대 최저 이동 기록 (없으면 null) */
  bestMoves: number | null;
  /** 새 게임 시작 콜백 */
  onNewGame?: () => void;
}

/**
 * 상단 아케이드 스탯 헤더 컴포넌트
 * 타이틀, 현재 이동 횟수(핵심 경쟁 지표), 역대 최고 기록(최소 이동) 및 새 게임 버튼을 표시합니다.
 */
export const HeaderStats: React.FC<HeaderStatsProps> = ({
  moves,
  bestMoves,
  onNewGame,
}) => {
  return (
    <header className="w-full max-w-sm mx-auto flex items-center justify-between gap-2 py-2 select-none">
      {/* 1. 타이틀 및 목표 안내 */}
      <div>
        <div className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-400 uppercase">
          STAGE 1024
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
          <span>1024</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CHALLENGE
          </span>
        </h1>
      </div>

      {/* 2. 스탯 카드 영역 */}
      <div className="flex items-center gap-2">
        {/* 현재 이동 횟수 카드 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-center min-w-[70px] shadow-md shadow-black/40">
          <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MOVES
          </div>
          <div className="text-base sm:text-lg font-black text-amber-400 font-mono leading-tight">
            {moves}
          </div>
        </div>

        {/* 최고 기록 (최소 이동) 카드 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-center min-w-[70px] shadow-md shadow-black/40">
          <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            BEST
          </div>
          <div className="text-base sm:text-lg font-black text-sky-400 font-mono leading-tight">
            {bestMoves !== null ? bestMoves : "-"}
          </div>
        </div>

        {/* 리셋 버튼 (제공된 경우) */}
        {onNewGame && (
          <button
            onClick={onNewGame}
            title="새 게임 시작"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition-all shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};
