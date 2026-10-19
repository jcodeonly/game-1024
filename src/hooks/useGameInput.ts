"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Direction } from "@/game/types";

/** 최소 스와이프 거리 임계값 (px): 이 이상이어야 유효한 스와이프로 인정 */
const MIN_SWIPE_DISTANCE = 30;

/** 방향키 및 WASD 키코드 → Direction 매핑 테이블 */
const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  KeyW: "UP",
  KeyS: "DOWN",
  KeyA: "LEFT",
  KeyD: "RIGHT",
};

/**
 * 스와이프 델타값(dx, dy)으로부터 이동 방향을 계산합니다.
 * 30px 미만이거나 델타가 0인 경우 null을 반환합니다.
 * 사선 스와이프는 더 큰 축 방향으로 판정합니다.
 *
 * @param dx 수평 이동량 (오른쪽 양수)
 * @param dy 수직 이동량 (아래쪽 양수)
 * @returns Direction 또는 null
 */
export function getDirectionFromSwipe(dx: number, dy: number): Direction | null {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const maxDelta = Math.max(absDx, absDy);

  if (maxDelta < MIN_SWIPE_DISTANCE) return null;

  // 더 큰 축 방향으로 판정
  if (absDx >= absDy) {
    return dx > 0 ? "RIGHT" : "LEFT";
  } else {
    return dy > 0 ? "DOWN" : "UP";
  }
}

/**
 * 키보드 이벤트 코드(event.code)로부터 방향을 반환합니다.
 *
 * @param code KeyboardEvent.code 값
 * @returns Direction 또는 null
 */
export function getDirectionFromKey(code: string): Direction | null {
  return KEY_MAP[code] ?? null;
}

/** useGameInput 훅의 콜백 인터페이스 */
interface UseGameInputOptions {
  /** 방향 입력 발생 시 호출되는 콜백 */
  onMove: (direction: Direction) => void;
  /** 입력 비활성화 여부 (게임 종료 후 입력 차단) */
  disabled?: boolean;
}

/**
 * 키보드(방향키, WASD) 및 모바일 터치 스와이프 입력을 처리하는 커스텀 훅
 * touch-action: none을 통해 모바일 스크롤과의 충돌을 방지합니다.
 *
 * @param containerRef 이벤트를 등록할 게임 보드 컨테이너 ref
 * @param options 이동 콜백 및 비활성화 옵션
 */
export function useGameInput(
  containerRef: React.RefObject<HTMLElement>,
  options: UseGameInputOptions
): void {
  const { onMove, disabled = false } = options;
  // 최신 콜백을 ref로 유지하여 effect 재등록 없이 갱신
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: Event) => {
      if (disabled) return;
      const ke = e as KeyboardEvent;
      const direction = getDirectionFromKey(ke.code);
      if (direction) {
        e.preventDefault();
        onMoveRef.current(direction);
      }
    },
    [disabled]
  );

  const handleTouchStart = useCallback((e: Event) => {
    const te = e as TouchEvent;
    const touch = te.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: Event) => {
      if (disabled || !touchStartRef.current) return;
      const te = e as TouchEvent;
      const touch = te.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      const direction = getDirectionFromSwipe(dx, dy);
      if (direction) onMoveRef.current(direction);
    },
    [disabled]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    window.addEventListener("keydown", handleKeyDown);
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, handleKeyDown, handleTouchStart, handleTouchEnd]);
}
