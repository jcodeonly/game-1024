import { Direction, Position, SlideResult } from "./types";
import { Tile } from "./Tile";

/**
 * 4x4 게임 보드의 상태 및 수학적 매트릭스 변환을 전담하는 클래스
 * 타일 슬라이딩, 2048 표준 병합 규칙, 90도 시계방향 회전 매트릭스 연산을 수행합니다.
 */
export class Board {
  /** 보드의 가로/세로 칸 수 (표준 4) */
  public readonly size: number;
  /** 2차원 타일 매트릭스 [행][열] */
  private grid: (Tile | null)[][];

  /**
   * Board 생성자
   * @param size 보드 한 변의 크기 (기본값: 4)
   */
  constructor(size: number = 4) {
    this.size = size;
    this.grid = this.createEmptyGrid(size);
  }

  /**
   * 빈 그리드 매트릭스를 생성합니다.
   */
  private createEmptyGrid(size: number): (Tile | null)[][] {
    const grid: (Tile | null)[][] = [];
    for (let r = 0; r < size; r++) {
      grid.push(new Array(size).fill(null));
    }
    return grid;
  }

  /**
   * 특정 좌표의 타일을 반환합니다.
   */
  public getTile(row: number, col: number): Tile | null {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return null;
    return this.grid[row][col];
  }

  /**
   * 특정 좌표에 타일을 설정합니다.
   */
  public setTile(row: number, col: number, tile: Tile | null): void {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = tile;
      if (tile) {
        tile.row = row;
        tile.col = col;
      }
    }
  }

  /**
   * 현재 보드에 존재하는 모든 타일 배열을 반환합니다.
   */
  public getAllTiles(): Tile[] {
    const tiles: Tile[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        if (tile) {
          tiles.push(tile);
        }
      }
    }
    return tiles;
  }

  /**
   * 보드에서 비어있는 모든 좌표 목록을 반환합니다.
   */
  public getEmptyPositions(): Position[] {
    const empty: Position[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) {
          empty.push({ row: r, col: c });
        }
      }
    }
    return empty;
  }

  /**
   * 빈 공간 중 한 곳을 무작위로 골라 신규 타일(90% 확률로 2, 10% 확률로 4)을 생성합니다.
   */
  public spawnRandomTile(): Tile | null {
    const emptyPositions = this.getEmptyPositions();
    if (emptyPositions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const { row, col } = emptyPositions[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    const newTile = new Tile(value, row, col);
    this.grid[row][col] = newTile;
    return newTile;
  }

  /**
   * 지정한 방향으로 타일들을 슬라이드하고 동일한 숫자를 병합합니다.
   * @param direction 이동 방향 (UP, DOWN, LEFT, RIGHT)
   * @returns 실제 이동 여부 및 병합 점수
   */
  public slide(direction: Direction): SlideResult {
    let moved = false;
    let scoreDelta = 0;

    // 모든 타일의 이전 애니메이션 플래그 초기화
    for (const tile of this.getAllTiles()) {
      tile.resetAnimationFlags();
    }

    // 방향에 따라 탐색 순서 및 벡터 정의
    const isHorizontal = direction === "LEFT" || direction === "RIGHT";
    const isForward = direction === "LEFT" || direction === "UP";

    for (let i = 0; i < this.size; i++) {
      // 1줄 단위 라인 추출
      const lineIndices: Position[] = [];
      for (let j = 0; j < this.size; j++) {
        const row = isHorizontal ? i : isForward ? j : this.size - 1 - j;
        const col = isHorizontal ? (isForward ? j : this.size - 1 - j) : i;
        lineIndices.push({ row, col });
      }

      // 라인 내의 타일들을 압축 및 병합
      const tilesInLine: Tile[] = [];
      for (const pos of lineIndices) {
        const tile = this.grid[pos.row][pos.col];
        if (tile) tilesInLine.push(tile);
      }

      const mergedTiles: (Tile | null)[] = [];
      let k = 0;
      while (k < tilesInLine.length) {
        const current = tilesInLine[k];
        if (k + 1 < tilesInLine.length && current.value === tilesInLine[k + 1].value) {
          // 병합 발생! 두 값을 합침
          const next = tilesInLine[k + 1];
          const mergedVal = current.value * 2;
          scoreDelta += mergedVal;

          const mergedTile = new Tile(mergedVal, current.row, current.col);
          mergedTile.isMerged = true;
          mergedTiles.push(mergedTile);
          k += 2;
          moved = true;
        } else {
          mergedTiles.push(current);
          k++;
        }
      }

      // 라인에 다시 배치
      for (let idx = 0; idx < this.size; idx++) {
        const pos = lineIndices[idx];
        const newTile = mergedTiles[idx] || null;
        const oldTile = this.grid[pos.row][pos.col];

        if (newTile) {
          if (!oldTile || oldTile.id !== newTile.id || oldTile.row !== pos.row || oldTile.col !== pos.col) {
            moved = true;
          }
          newTile.updatePosition(pos.row, pos.col);
          this.grid[pos.row][pos.col] = newTile;
        } else {
          if (oldTile) {
            moved = true;
          }
          this.grid[pos.row][pos.col] = null;
        }
      }
    }

    return { moved, scoreDelta };
  }

  /**
   * 100턴 회전 기믹: 보드 전체를 시계방향으로 90도 회전합니다.
   * 변환 공식: (row, col) -> (col, size - 1 - row)
   * 타일의 물리적 좌표를 새로운 위치로 변경합니다.
   */
  public rotateClockwise90(): void {
    const newGrid = this.createEmptyGrid(this.size);

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        if (tile) {
          const newRow = c;
          const newCol = this.size - 1 - r;
          tile.updatePosition(newRow, newCol);
          newGrid[newRow][newCol] = tile;
        }
      }
    }

    this.grid = newGrid;
  }

  /**
   * 상하좌우 이동 가능한 타일이 남아있는지 확인합니다.
   */
  public hasAvailableMoves(): boolean {
    // 1. 빈 칸이 남아있으면 이동 가능
    if (this.getEmptyPositions().length > 0) return true;

    // 2. 가로 또는 세로로 인접한 타일 중 값이 같은 타일이 있으면 병합 가능
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const current = this.grid[r][c];
        if (!current) return true;

        // 오른쪽 확인
        if (c + 1 < this.size) {
          const right = this.grid[r][c + 1];
          if (right && right.value === current.value) return true;
        }
        // 아래쪽 확인
        if (r + 1 < this.size) {
          const down = this.grid[r + 1][c];
          if (down && down.value === current.value) return true;
        }
      }
    }

    return false;
  }

  /**
   * 목표 값(예: 1024)을 가진 타일이 존재하는지 확인합니다.
   */
  public hasTargetTile(targetValue: number): boolean {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        if (tile && tile.value >= targetValue) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 보드를 초기화합니다.
   */
  public reset(): void {
    this.grid = this.createEmptyGrid(this.size);
  }
}
