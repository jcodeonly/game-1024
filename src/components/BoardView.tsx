"use client";

import React from "react";
import { Board } from "@/game/Board";
import { Tile } from "@/game/Tile";
import { TileView } from "./TileView";

interface BoardViewProps {
  /** 렌더링할 Board 인스턴스 (선택적) */
  board?: Board;
  /** 직접 전달하는 타일 목록 (상태 기반 렌더링용, 선택적) */
  tiles?: Tile[];
  /** 보드 회전 각도 (0, 90, 180, 270, ...) */
  boardRotationDegree: number;
}

/**
 * 4x4 게임 보드 및 타일들을 렌더링하는 컴포넌트
 * 모바일 작은 화면에서도 가로 세로 1:1 비율을 유지하고,
 * 100턴 회전 시 컨테이너 전체를 90도 시계방향으로 부드럽게 회전시킵니다.
 */
export const BoardView: React.FC<BoardViewProps> = ({ board, tiles, boardRotationDegree }) => {
  const renderedTiles = tiles ?? board?.getAllTiles() ?? [];

  // 보드 전체 회전 애니메이션 스타일
  const boardRotationStyle = {
    transform: `rotate(${boardRotationDegree}deg)`,
    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // 16개 배경 셀 렌더링용 배열 (0 ~ 15)
  const backgroundCells = Array.from({ length: 16 }, (_, idx) => idx);

  return (
    <div className="w-full max-w-sm mx-auto aspect-square p-2 sm:p-3 relative select-none no-scroll-touch">
      {/* 90도 시계방향 회전이 적용되는 메인 보드 컨테이너 */}
      <div
        className="game-board-container w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-2 relative shadow-2xl shadow-black/60 overflow-hidden"
        style={boardRotationStyle}
      >
        {/* 1. 4x4 배경 빈 격자 그리드 */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2">
          {backgroundCells.map((idx) => (
            <div
              key={`bg-cell-${idx}`}
              className="grid-cell w-full h-full bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/30"
            />
          ))}
        </div>

        {/* 2. 실제 타일 레이어 (절대 좌표 오버레이) */}
        <div className="absolute inset-2 pointer-events-none">
          {renderedTiles.map((tile) => (
            <TileView
              key={tile.id}
              tile={tile}
              boardRotationDegree={boardRotationDegree}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
