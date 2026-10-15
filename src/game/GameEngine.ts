import { Direction, GameEngineOptions, GameStatus } from "./types";
import { Board } from "./Board";

/**
 * 1024 스페셜 게임의 전체 상태 머신 및 규칙을 총괄하는 엔진 클래스
 * 이동 횟수 기반 경쟁, 100턴 주기 90도 회전 기믹, 즉시 승리/패배 상태를 제어합니다.
 */
export class GameEngine {
  /** 게임 보드 객체 */
  private board: Board;
  /** 현재까지 소모한 유효 이동 횟수 */
  private moveCount: number;
  /** 보드 회전 발동 주기 (기본: 100회) */
  public readonly rotateInterval: number;
  /** 승리 목표 타일 값 (기본: 1024) */
  public readonly targetValue: number;
  /** 현재 게임 상태 (IDLE, PLAYING, WON, GAME_OVER) */
  private status: GameStatus;
  /** 회전 발동 횟수 누적 */
  private rotationCount: number;
  /** UI 렌더링용 보드 누적 회전 각도 (0, 90, 180, 270, ...) */
  private boardRotationDegree: number;

  /**
   * GameEngine 생성자
   * @param options 보드 크기, 회전 주기, 목표 값 설정 옵션
   */
  constructor(options: GameEngineOptions = {}) {
    const size = options.boardSize ?? 4;
    this.rotateInterval = options.rotateInterval ?? 100;
    this.targetValue = options.targetValue ?? 1024;

    this.board = new Board(size);
    this.moveCount = 0;
    this.rotationCount = 0;
    this.boardRotationDegree = 0;
    this.status = "PLAYING";

    this.initGame();
  }

  /**
   * 게임을 초기화하고 무작위 타일 2개를 스폰합니다.
   */
  private initGame(): void {
    this.board.reset();
    this.board.spawnRandomTile();
    this.board.spawnRandomTile();
    this.moveCount = 0;
    this.rotationCount = 0;
    this.boardRotationDegree = 0;
    this.status = "PLAYING";
  }

  /**
   * 게임을 처음부터 재시작합니다.
   */
  public restart(): void {
    this.initGame();
  }

  /**
   * 사용자의 방향 입력을 처리합니다.
   * @param direction 이동 방향 (UP, DOWN, LEFT, RIGHT)
   * @returns 실제로 이동이 수행되었는지 여부
   */
  public handleMove(direction: Direction): boolean {
    if (this.status !== "PLAYING") {
      return false;
    }

    const { moved } = this.board.slide(direction);
    if (!moved) {
      return false;
    }

    // 1. 유효한 이동 시 이동 횟수 1 증가
    this.moveCount++;

    // 2. 1024 타일 생성 여부 검사 -> 생성 시 즉시 승리!
    if (this.board.hasTargetTile(this.targetValue)) {
      this.status = "WON";
      return true;
    }

    // 3. 100턴 회전 기믹 검사: 누적 이동 수가 100의 배수일 때 발동
    if (this.moveCount % this.rotateInterval === 0) {
      this.board.rotateClockwise90();
      this.rotationCount++;
      this.boardRotationDegree += 90;
    }

    // 4. 새로운 타일 1개 생성
    this.board.spawnRandomTile();

    // 5. 다시 이동 후 1024 완성 확인
    if (this.board.hasTargetTile(this.targetValue)) {
      this.status = "WON";
      return true;
    }

    // 6. 게임 오버(더 이상 이동 불가) 판정
    if (!this.board.hasAvailableMoves()) {
      this.status = "GAME_OVER";
    }

    return true;
  }

  /**
   * 다음 90도 회전까지 남은 이동 횟수를 계산하여 반환합니다.
   * 예: moveCount가 0이면 100, 58이면 42 반환.
   */
  public getRemainingMovesUntilRotation(): number {
    const remainder = this.moveCount % this.rotateInterval;
    return remainder === 0 && this.moveCount > 0 ? this.rotateInterval : this.rotateInterval - remainder;
  }

  /** 현재 이동 횟수 반환 */
  public getMoveCount(): number {
    return this.moveCount;
  }

  /** 현재 게임 상태 반환 */
  public getStatus(): GameStatus {
    return this.status;
  }

  /** 보드 인스턴스 반환 */
  public getBoard(): Board {
    return this.board;
  }

  /** 회전 누적 횟수 반환 */
  public getRotationCount(): number {
    return this.rotationCount;
  }

  /** 보드 시각적 회전 각도 반환 (CSS transform용) */
  public getBoardRotationDegree(): number {
    return this.boardRotationDegree;
  }

  /** 단위 테스트용: 이동 횟수 강제 설정 메서드 */
  public setMoveCountForTesting(count: number): void {
    this.moveCount = count;
  }
}
