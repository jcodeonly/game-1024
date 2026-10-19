"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { GameEngine } from "@/game/GameEngine";
import type { Direction, GameStatus } from "@/game/types";
import { BoardView } from "./BoardView";
import { HeaderStats } from "./HeaderStats";
import { RotationGauge } from "./RotationGauge";
import { useGameInput } from "@/hooks/useGameInput";

interface GameContainerProps {
  /** 외부 웹서비스 임베드 시 추가 스타일링 클래스 */
  className?: string;
}

/**
 * 1024 스페셜 게임 최상위 인터랙티브 컨테이너 (클라이언트 컴포넌트)
 * GameEngine 인스턴스와 React 상태를 동기화하고 키보드/터치 입력을 바인딩합니다.
 */
export const GameContainer: React.FC<GameContainerProps> = ({ className = "" }) => {
  // 1. 객체지향 GameEngine 인스턴스 초기화
  const [engine] = useState(() => new GameEngine({ boardSize: 4, rotateInterval: 100, targetValue: 1024 }));

  // 2. React 리렌더링을 유발하기 위한 반응형 상태
  const [moves, setMoves] = useState<number>(0);
  const [remainingToRotate, setRemainingToRotate] = useState<number>(100);
  const [rotationDegree, setRotationDegree] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>("PLAYING");
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  // 로컬스토리지에서 최저 이동 기록 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem("game1024_best_moves");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) setBestMoves(parsed);
      }
    } catch {
      // SSR or restricted iframe fallback
    }
  }, []);

  // 보드 컨테이너 DOM 참조 (터치 스와이프 리스너 등록용)
  const containerRef = useRef<HTMLDivElement>(null);

  // 3. 엔진 상태를 React 상태로 동기화하는 함수
  const syncEngineState = useCallback(() => {
    setMoves(engine.getMoveCount());
    setRemainingToRotate(engine.getRemainingMovesUntilRotation());
    setRotationDegree(engine.getBoardRotationDegree());
    const currentStatus = engine.getStatus();
    setStatus(currentStatus);

    // 승리 시 최저 기록 갱신 처리
    if (currentStatus === "WON") {
      const currentMoves = engine.getMoveCount();
      setBestMoves((prev) => {
        if (prev === null || currentMoves < prev) {
          try {
            localStorage.setItem("game1024_best_moves", currentMoves.toString());
          } catch {}
          return currentMoves;
        }
        return prev;
      });
    }
  }, [engine]);

  // 4. 방향 이동 핸들러
  const handleMove = useCallback(
    (direction: Direction) => {
      const moved = engine.handleMove(direction);
      if (moved) {
        syncEngineState();
      }
    },
    [engine, syncEngineState]
  );

  // 5. 새 게임 재시작 핸들러
  const handleNewGame = useCallback(() => {
    engine.restart();
    syncEngineState();
  }, [engine, syncEngineState]);

  // 6. 키보드 및 모바일 스와이프 입력 훅 연동
  useGameInput(containerRef, {
    onMove: handleMove,
    disabled: status === "WON" || status === "GAME_OVER",
  });

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-sm mx-auto flex flex-col items-center justify-between gap-3 select-none no-scroll-touch ${className}`}
    >
      {/* 상단 스탯 헤더 (STAGE 1024, 현재 이동 수, 최고 기록, 재시작 버튼) */}
      <HeaderStats moves={moves} bestMoves={bestMoves} onNewGame={handleNewGame} />

      {/* 100턴 90도 회전 경고 게이지 바 */}
      <RotationGauge remainingMoves={remainingToRotate} totalInterval={100} />

      {/* 4x4 게임 보드 및 회전/타일 애니메이션 뷰 */}
      <BoardView board={engine.getBoard()} boardRotationDegree={rotationDegree} />

      {/* 하단 조작 가이드 안내 */}
      <div className="w-full text-center text-xs text-slate-500 py-1">
        <span>화면 스와이프 또는 방향키(WASD)로 조작</span>
      </div>
    </div>
  );
};
