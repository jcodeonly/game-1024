"use client";

import React from "react";

interface GameOverModalProps {
  /** 종료 시점의 이동 횟수 */
  moves: number;
  /** 다시 시작 콜백 */
  onRestart: () => void;
}

/**
 * 더 이상 이동할 수 없을 때 노출되는 게임 오버 모달
 */
export const GameOverModal: React.FC<GameOverModalProps> = ({ moves, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-xs bg-slate-900 border border-rose-500/50 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(244,63,94,0.3)]">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-2xl">
          💀
        </div>

        <div className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-1">
          GAME OVER
        </div>
        <h2 className="text-xl font-black text-white mb-3">더 이상 합칠 수 없습니다</h2>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 mb-4 text-xs text-slate-300">
          진행한 이동 횟수: <span className="font-mono font-bold text-rose-400 text-sm">{moves}회</span>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-sm border border-slate-700 transition-all shadow-md"
        >
          새 게임 시작하기
        </button>
      </div>
    </div>
  );
};
