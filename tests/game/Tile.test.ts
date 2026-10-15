import { describe, it, expect } from "vitest";
import { Tile } from "@/game/Tile";

describe("Tile 모델 클래스", () => {
  it("기본 속성을 올바르게 초기화해야 한다", () => {
    const tile = new Tile(2, 1, 2);
    expect(tile.value).toBe(2);
    expect(tile.row).toBe(1);
    expect(tile.col).toBe(2);
    expect(tile.prevRow).toBe(1);
    expect(tile.prevCol).toBe(2);
    expect(tile.isMerged).toBe(false);
    expect(tile.isNew).toBe(true);
    expect(typeof tile.id).toBe("string");
  });

  it("좌표 업데이트 시 이전 좌표(prevRow, prevCol)를 보존해야 한다", () => {
    const tile = new Tile(4, 0, 0);
    tile.updatePosition(2, 3);
    expect(tile.row).toBe(2);
    expect(tile.col).toBe(3);
    expect(tile.prevRow).toBe(0);
    expect(tile.prevCol).toBe(0);
  });

  it("복제(clone) 시 동일한 값과 상태를 복사해야 한다", () => {
    const tile = new Tile(8, 1, 1, "test-id");
    const cloned = tile.clone();
    expect(cloned.id).toBe("test-id");
    expect(cloned.value).toBe(8);
    expect(cloned.row).toBe(1);
    expect(cloned.col).toBe(1);
    expect(cloned).not.toBe(tile);
  });
});
