import { describe, it, expect } from "vitest";
import { Board } from "@/game/Board";
import { Tile } from "@/game/Tile";

describe("Bug reproduction", () => {
  it("row 2 col 2 and col 3 tiles should merge into 4 at col 3 when sliding RIGHT", () => {
    const board = new Board(4);
    board.setTile(2, 2, new Tile(2, 2, 2));
    board.setTile(2, 3, new Tile(2, 2, 3));

    const result = board.slide("RIGHT");
    expect(result.moved).toBe(true);
    expect(board.getTile(2, 3)?.value).toBe(4);
    expect(board.getTile(2, 2)).toBeNull();
  });
});
