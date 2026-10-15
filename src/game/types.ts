/**
 * 1024 게임에서 사용되는 공통 타입 및 인터페이스 정의
 */

/** 이동 방향 타입: 상, 하, 좌, 우 */
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

/** 게임 진행 상태 머신 타입 */
export type GameStatus = "IDLE" | "PLAYING" | "WON" | "GAME_OVER";

/** 보드 상의 2차원 좌표 인터페이스 */
export interface Position {
  row: number;
  col: number;
}

/** 슬라이드 동작 수행 결과 인터페이스 */
export interface SlideResult {
  /** 타일이 실제로 한 칸이라도 움직였거나 합쳐졌는지 여부 */
  moved: boolean;
  /** 이번 슬라이드로 병합되어 얻은 점수 합계 (참고용) */
  scoreDelta: number;
}

/** 게임 엔진 옵션 설정 인터페이스 */
export interface GameEngineOptions {
  /** 보드 크기 (기본값: 4x4) */
  boardSize?: number;
  /** 보드 회전 발동 이동 주기 (기본값: 100회) */
  rotateInterval?: number;
  /** 승리 목표 타일 값 (기본값: 1024) */
  targetValue?: number;
}
