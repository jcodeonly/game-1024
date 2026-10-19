import { describe, it, expect } from "vitest";
import { GameEngine } from "@/game/GameEngine";
import { Tile } from "@/game/Tile";

describe("GameEngine handleMove RIGHT", () => {
  it("should merge two 2s into 4 when sliding right", () => {
    const engine = new GameEngine();
    const board = engine.getBoard();
    board.reset();

    board.setTile(2, 2, new Tile(2, 2, 2));
    board.setTile(2, 3, new Tile(2, 2, 3));

    expect(board.getAllTiles().length).toBe(2);

    const moved = engine.handleMove("RIGHT");
    expect(moved).toBe(true);

    const tiles = board.getAllTiles();
    console.log("TILES AFTER MOVE:", tiles.map(t => ({ row: t.row, col: t.col, val: t.value })));

    const tileAt23 = board.getTile(2, 3);
    expect(tileAt23?.value).toBe(4);
  });
});
