"use client";

import React from "react";

interface VictoryModalProps {
  /** 최종 소모된 이동 횟수 */
  moves: number;
  /** 역대 최저 이동 기록 */
  bestMoves: number | null;
  /** 이번 승리가 신기록인지 여부 */
  isNewRecord: boolean;
  /** 다시 도전하기 버튼 콜백 */
  onRestart: () => void;
}

/**
 * 1024 타일 달성 시 즉시 팝업되는 승리 결과 모달
 * 최소 이동 횟수 기반 경쟁 결과를 강조하여 표시합니다.
 */
export const VictoryModal: React.FC<VictoryModalProps> = ({
  moves,
  bestMoves,
  isNewRecord,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-xs bg-slate-900 border border-amber-500/50 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
        {/* 황금 트로피 아이콘 */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shadow-inner shadow-amber-500/50">
          🏆
        </div>

        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1">
          VICTORY! STAGE CLEARED
        </div>
        <h2 className="text-2xl font-black text-white mb-4">1024 달성!</h2>

        {/* 최종 이동 횟수 하이라이트 박스 */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-4">
          <div className="text-xs text-slate-400 font-semibold mb-1">최종 소모 이동 횟수</div>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-tight">
            {moves}
            <span className="text-sm font-medium text-slate-300 ml-1">MOVES</span>
          </div>

          {/* 신기록 배지 */}
          {isNewRecord && (
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 animate-bounce">
              ⭐ NEW BEST RECORD!
            </div>
          )}

          {!isNewRecord && bestMoves !== null && (
            <div className="mt-2 text-[11px] text-slate-400">
              역대 최고 기록: <span className="text-sky-400 font-bold font-mono">{bestMoves}회</span>
            </div>
          )}
        </div>

        {/* 다시 도전하기 액션 버튼 */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 transition-all"
        >
          더 적은 횟수로 다시 도전
        </button>
      </div>
    </div>
  );
};
