import { describe, it, expect, beforeEach } from "vitest";
import { Board } from "@/game/Board";
import { Tile } from "@/game/Tile";

describe("Board 클래스", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(4);
  });

  it("초기 4x4 보드는 비어 있어야 한다", () => {
    expect(board.getEmptyPositions().length).toBe(16);
    expect(board.getAllTiles().length).toBe(0);
  });

  it("무작위 타일 생성 시 2 또는 4 값을 가져야 한다", () => {
    const tile = board.spawnRandomTile();
    expect(tile).not.toBeNull();
    expect([2, 4]).toContain(tile!.value);
    expect(board.getEmptyPositions().length).toBe(15);
  });

  it("왼쪽 슬라이드 시 타일들이 왼쪽으로 이동하고 병합되어야 한다", () => {
    // 0행에 [2, 0, 2, 4] 배치 -> 왼쪽 슬라이드 결과 [4, 4, 0, 0]
    board.setTile(0, 0, new Tile(2, 0, 0));
    board.setTile(0, 2, new Tile(2, 0, 2));
    board.setTile(0, 3, new Tile(4, 0, 3));

    const result = board.slide("LEFT");
    expect(result.moved).toBe(true);
    expect(board.getTile(0, 0)?.value).toBe(4);
    expect(board.getTile(0, 1)?.value).toBe(4);
    expect(board.getTile(0, 2)).toBeNull();
    expect(board.getTile(0, 3)).toBeNull();
  });

  it("연속 병합(Chained Merge)은 한 번의 이동에서 방지되어야 한다 (예: [2, 2, 2, 2] -> [4, 4, 0, 0])", () => {
    board.setTile(0, 0, new Tile(2, 0, 0));
    board.setTile(0, 1, new Tile(2, 0, 1));
    board.setTile(0, 2, new Tile(2, 0, 2));
    board.setTile(0, 3, new Tile(2, 0, 3));

    const result = board.slide("LEFT");
    expect(result.moved).toBe(true);
    expect(board.getTile(0, 0)?.value).toBe(4);
    expect(board.getTile(0, 1)?.value).toBe(4);
    expect(board.getTile(0, 2)).toBeNull();
    expect(board.getTile(0, 3)).toBeNull();
  });

  it("시계방향 90도 회전 공식 (row, col) -> (col, 3 - row)이 정확히 동작해야 한다", () => {
    // (0, 1) 위치에 타일 8 배치
    board.setTile(0, 1, new Tile(8, 0, 1));

    // 시계방향 90도 회전: (0, 1) -> (1, 3 - 0) = (1, 3)
    board.rotateClockwise90();

    expect(board.getTile(0, 1)).toBeNull();
    const rotatedTile = board.getTile(1, 3);
    expect(rotatedTile).not.toBeNull();
    expect(rotatedTile?.value).toBe(8);
    expect(rotatedTile?.row).toBe(1);
    expect(rotatedTile?.col).toBe(3);
  });

  it("더 이상 이동할 수 없을 때 hasAvailableMoves()가 false를 반환해야 한다", () => {
    // 빈칸 없이 서로 다른 숫자로 채우기
    let val = 2;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        // 체스판처럼 인접 칸이 같지 않도록 배치
        const tileVal = (r + c) % 2 === 0 ? 2 : 4;
        board.setTile(r, c, new Tile(tileVal, r, c));
      }
    }
    // 인접한 타일이 모두 다르면 이동 불가
    // 단 체스판 방식은 2x2에서 [2, 4], [4, 2] 형태여서 가로세로 모두 다름!
    expect(board.hasAvailableMoves()).toBe(false);
  });

  it("특정 타일 값 존재 여부를 정확히 판별해야 한다 (hasTargetTile)", () => {
    board.setTile(2, 2, new Tile(1024, 2, 2));
    expect(board.hasTargetTile(1024)).toBe(true);
    expect(board.hasTargetTile(2048)).toBe(false);
  });
});
