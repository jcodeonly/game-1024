import { describe, it, expect, beforeEach } from "vitest";
import { Board } from "@/game/Board";
import { Tile } from "@/game/Tile";

describe("Board slide all directions", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(4);
  });

  it("RIGHT: [0, 0, 2, 2] -> [0, 0, 0, 4]", () => {
    board.setTile(2, 2, new Tile(2, 2, 2));
    board.setTile(2, 3, new Tile(2, 2, 3));
    const res = board.slide("RIGHT");
    expect(res.moved).toBe(true);
    expect(board.getTile(2, 3)?.value).toBe(4);
    expect(board.getTile(2, 2)).toBeNull();
  });

  it("RIGHT: [2, 2, 0, 0] -> [0, 0, 0, 4]", () => {
    board.setTile(2, 0, new Tile(2, 2, 0));
    board.setTile(2, 1, new Tile(2, 2, 1));
    const res = board.slide("RIGHT");
    expect(res.moved).toBe(true);
    expect(board.getTile(2, 3)?.value).toBe(4);
    expect(board.getTile(2, 0)).toBeNull();
    expect(board.getTile(2, 1)).toBeNull();
  });

  it("RIGHT: [2, 0, 2, 0] -> [0, 0, 0, 4]", () => {
    board.setTile(2, 0, new Tile(2, 2, 0));
    board.setTile(2, 2, new Tile(2, 2, 2));
    const res = board.slide("RIGHT");
    expect(res.moved).toBe(true);
    expect(board.getTile(2, 3)?.value).toBe(4);
    expect(board.getTile(2, 0)).toBeNull();
    expect(board.getTile(2, 2)).toBeNull();
  });

  it("LEFT: [0, 0, 2, 2] -> [4, 0, 0, 0]", () => {
    board.setTile(2, 2, new Tile(2, 2, 2));
    board.setTile(2, 3, new Tile(2, 2, 3));
    const res = board.slide("LEFT");
    expect(res.moved).toBe(true);
    expect(board.getTile(2, 0)?.value).toBe(4);
    expect(board.getTile(2, 2)).toBeNull();
    expect(board.getTile(2, 3)).toBeNull();
  });

  it("DOWN: [2, 2] in column 2 -> [4] at bottom", () => {
    board.setTile(0, 2, new Tile(2, 0, 2));
    board.setTile(1, 2, new Tile(2, 1, 2));
    const res = board.slide("DOWN");
    expect(res.moved).toBe(true);
    expect(board.getTile(3, 2)?.value).toBe(4);
    expect(board.getTile(0, 2)).toBeNull();
    expect(board.getTile(1, 2)).toBeNull();
  });

  it("UP: [2, 2] in column 2 -> [4] at top", () => {
    board.setTile(2, 2, new Tile(2, 2, 2));
    board.setTile(3, 2, new Tile(2, 3, 2));
    const res = board.slide("UP");
    expect(res.moved).toBe(true);
    expect(board.getTile(0, 2)?.value).toBe(4);
    expect(board.getTile(2, 2)).toBeNull();
    expect(board.getTile(3, 2)).toBeNull();
  });
});
