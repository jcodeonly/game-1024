"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { GameEngine } from "@/game/GameEngine";
import { Tile } from "@/game/Tile";
import type { Direction, GameStatus } from "@/game/types";
import { BoardView } from "./BoardView";
import { HeaderStats } from "./HeaderStats";
import { RotationGauge } from "./RotationGauge";
import { VictoryModal } from "./VictoryModal";
import { GameOverModal } from "./GameOverModal";
import { useGameInput } from "@/hooks/useGameInput";
import { getBestMoves, saveBestMoves } from "@/utils/storage";

interface GameContainerProps {
  /** 외부 웹서비스 임베드 시 추가 스타일링 클래스 */
  className?: string;
}

/**
 * 1024 스페셜 게임 최상위 인터랙티브 컨테이너 (클라이언트 컴포넌트)
 * GameEngine 인스턴스와 React 상태를 동기화하고 키보드/터치 입력 및 승리/패배 모달을 제어합니다.
 */
export const GameContainer: React.FC<GameContainerProps> = ({ className = "" }) => {
  // 1. SSR 정적 빌드 시 불일치(Hydration Mismatch)를 방지하기 위한 마운트 상태
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 2. 객체지향 GameEngine 인스턴스 초기화
  const [engine] = useState(() => new GameEngine({ boardSize: 4, rotateInterval: 100, targetValue: 1024 }));

  // 3. React 리렌더링 및 타일 반응형 상태 (불변 Tile 복제본 배열 보관)
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [remainingToRotate, setRemainingToRotate] = useState<number>(100);
  const [rotationDegree, setRotationDegree] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>("PLAYING");
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // 4. 엔진 상태를 React 상태로 동기화하는 함수
  const syncEngineState = useCallback(() => {
    const currentMoves = engine.getMoveCount();
    setMoves(currentMoves);
    setRemainingToRotate(engine.getRemainingMovesUntilRotation());
    setRotationDegree(engine.getBoardRotationDegree());
    const currentStatus = engine.getStatus();
    setStatus(currentStatus);

    // 타일 객체를 clone하여 불변 배열로 설정 -> React Re-render 및 DOM 동기화 보장
    setTiles(engine.getBoard().getAllTiles().map((t) => t.clone()));

    // 승리 시 최저 기록(Personal Best) 갱신 처리
    if (currentStatus === "WON") {
      const { isNewRecord: newRecord, bestMoves: updatedBest } = saveBestMoves(currentMoves);
      setIsNewRecord(newRecord);
      setBestMoves(updatedBest);
    }
  }, [engine]);

  // 클라이언트 마운트 시 초기 타일 동기화 및 로컬스토리지 기록 로드
  useEffect(() => {
    setIsMounted(true);
    setBestMoves(getBestMoves());
    syncEngineState();
  }, [syncEngineState]);

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
    setIsNewRecord(false);
    syncEngineState();
  }, [engine, syncEngineState]);

  // 보드 컨테이너 DOM 참조 (터치 스와이프 리스너 등록용)
  const containerRef = useRef<HTMLDivElement>(null);

  // 6. 키보드 및 모바일 스와이프 입력 훅 연동
  useGameInput(containerRef, {
    onMove: handleMove,
    disabled: status === "WON" || status === "GAME_OVER",
  });

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-sm mx-auto flex flex-col items-center justify-between gap-3 select-none no-scroll-touch relative ${className}`}
    >
      {/* 상단 스탯 헤더 (STAGE 1024, 현재 이동 수, 최고 기록, 재시작 버튼) */}
      <HeaderStats moves={moves} bestMoves={bestMoves} onNewGame={handleNewGame} />

      {/* 100턴 90도 회전 경고 게이지 바 */}
      <RotationGauge remainingMoves={remainingToRotate} totalInterval={100} />

      {/* 4x4 게임 보드 및 회전/타일 애니메이션 뷰 */}
      <BoardView
        board={engine.getBoard()}
        tiles={isMounted ? tiles : []}
        boardRotationDegree={rotationDegree}
      />

      {/* 하단 조작 가이드 안내 */}
      <div className="w-full text-center text-xs text-slate-500 py-1">
        <span>화면 스와이프 또는 방향키(WASD)로 조작</span>
      </div>

      {/* 현재 게임 버전 표시 */}
      <div className="w-full text-center text-[11px] text-slate-600 font-mono tracking-widest -mt-1 pb-1">
        v1.0.3
      </div>

      {/* 승리 팝업 모달 */}
      {status === "WON" && (
        <VictoryModal
          moves={moves}
          bestMoves={bestMoves}
          isNewRecord={isNewRecord}
          onRestart={handleNewGame}
        />
      )}

      {/* 게임 오버 팝업 모달 */}
      {status === "GAME_OVER" && (
        <GameOverModal moves={moves} onRestart={handleNewGame} />
      )}
    </div>
  );
};
