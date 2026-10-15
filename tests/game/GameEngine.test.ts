import { describe, it, expect, beforeEach } from "vitest";
import { GameEngine } from "@/game/GameEngine";
import { Tile } from "@/game/Tile";

describe("GameEngine 클래스 (게임 상태 머신 및 100턴 회전 관리)", () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine({ boardSize: 4, rotateInterval: 100, targetValue: 1024 });
  });

  it("게임 시작 시 2개의 초기 타일이 생성되고 이동 횟수는 0이어야 한다", () => {
    expect(engine.getMoveCount()).toBe(0);
    expect(engine.getStatus()).toBe("PLAYING");
    expect(engine.getBoard().getAllTiles().length).toBe(2);
    expect(engine.getRemainingMovesUntilRotation()).toBe(100);
  });

  it("유효한 이동 시 이동 횟수가 1 증가하고 새로운 타일이 생성되어야 한다", () => {
    // 모든 타일을 오른쪽으로 밀 수 있도록 좌측에 배치
    const board = engine.getBoard();
    // 기존 타일 제거 후 수동 배치
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board.setTile(r, c, null);
      }
    }
    board.setTile(0, 0, new Tile(2, 0, 0));

    const moved = engine.handleMove("RIGHT");
    expect(moved).toBe(true);
    expect(engine.getMoveCount()).toBe(1);
    expect(engine.getRemainingMovesUntilRotation()).toBe(99);
    // 원래 타일 1개 + 새로 생성된 타일 1개 = 2개
    expect(engine.getBoard().getAllTiles().length).toBe(2);
  });

  it("무효한 이동(타일 이동 없음) 시 이동 횟수가 증가하지 않아야 한다", () => {
    const board = engine.getBoard();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board.setTile(r, c, null);
      }
    }
    // 이미 가장 우측에 위치
    board.setTile(0, 3, new Tile(2, 0, 3));

    const moved = engine.handleMove("RIGHT");
    expect(moved).toBe(false);
    expect(engine.getMoveCount()).toBe(0);
    expect(engine.getRemainingMovesUntilRotation()).toBe(100);
    expect(engine.getBoard().getAllTiles().length).toBe(1);
  });

  it("100번째 이동 시 보드가 90도 시계방향으로 회전해야 한다", () => {
    // 99회까지 이동 수 강제 설정
    engine.setMoveCountForTesting(99);
    expect(engine.getRemainingMovesUntilRotation()).toBe(1);

    const board = engine.getBoard();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board.setTile(r, c, null);
      }
    }
    // (0, 0) 위치에 8 타일 배치
    board.setTile(0, 0, new Tile(8, 0, 0));

    // 오른쪽으로 100번째 이동 -> (0, 0) 타일이 (0, 3)으로 이동한 후 회전 발동!
    // 회전: (0, 3) -> (3, 3 - 0) = (3, 3)
    const moved = engine.handleMove("RIGHT");
    expect(moved).toBe(true);
    expect(engine.getMoveCount()).toBe(100);
    expect(engine.getRemainingMovesUntilRotation()).toBe(100);
    expect(engine.getRotationCount()).toBe(1);
  });

  it("1024 타일이 생성되면 즉시 WON(승리) 상태로 전환되어야 한다", () => {
    const board = engine.getBoard();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board.setTile(r, c, null);
      }
    }
    board.setTile(0, 0, new Tile(512, 0, 0));
    board.setTile(0, 1, new Tile(512, 0, 1));

    engine.handleMove("LEFT");
    expect(engine.getStatus()).toBe("WON");
    expect(engine.getBoard().hasTargetTile(1024)).toBe(true);
  });

  it("재시작(restart) 시 게임 상태가 초기화되어야 한다", () => {
    engine.setMoveCountForTesting(45);
    engine.restart();
    expect(engine.getMoveCount()).toBe(0);
    expect(engine.getStatus()).toBe("PLAYING");
    expect(engine.getBoard().getAllTiles().length).toBe(2);
  });
});
