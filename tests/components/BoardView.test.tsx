import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Board } from "@/game/Board";
import { Tile } from "@/game/Tile";
import { BoardView } from "@/components/BoardView";
import { TileView } from "@/components/TileView";

describe("TileView 및 BoardView 컴포넌트", () => {
  it("TileView는 숫자 값을 정확히 렌더링해야 한다", () => {
    const tile = new Tile(64, 1, 2);
    render(<TileView tile={tile} boardRotationDegree={0} />);
    expect(screen.getByText("64")).toBeInTheDocument();
  });

  it("TileView는 보드가 회전(90도)할 때 숫자를 원래 정방향(0도)으로 유지하기 위해 역회전 스타일(-90deg)을 적용해야 한다", () => {
    const tile = new Tile(128, 0, 0);
    const { container } = render(<TileView tile={tile} boardRotationDegree={90} />);
    const textElement = container.querySelector(".tile-number");
    expect(textElement).not.toBeNull();
    // 텍스트는 rotate(-90deg)로 역회전되어 사용자 눈에는 0도 정방향 유지
    expect(textElement?.getAttribute("style")).toContain("rotate(-90deg)");
  });

  it("BoardView는 4x4 배경 셀 16개와 현재 타일들을 올바르게 렌더링해야 한다", () => {
    const board = new Board(4);
    board.setTile(0, 0, new Tile(2, 0, 0));
    board.setTile(2, 3, new Tile(1024, 2, 3));

    const { container } = render(<BoardView board={board} boardRotationDegree={0} />);

    // 배경 셀 16개 확인
    const backgroundCells = container.querySelectorAll(".grid-cell");
    expect(backgroundCells.length).toBe(16);

    // 타일 값 렌더링 확인
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1024")).toBeInTheDocument();
  });

  it("BoardView 보드 컨테이너는 boardRotationDegree에 맞춰 rotate 스타일이 적용되어야 한다", () => {
    const board = new Board(4);
    const { container } = render(<BoardView board={board} boardRotationDegree={180} />);
    const boardElement = container.querySelector(".game-board-container");
    expect(boardElement?.getAttribute("style")).toContain("rotate(180deg)");
  });
});
