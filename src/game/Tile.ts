/**
 * 게임 보드 상의 개별 숫자 타일을 표현하는 객체지향 모델 클래스
 * 타일의 고유 식별자, 숫자 값, 현재 위치 및 애니메이션을 위한 이전 위치를 관리합니다.
 */
export class Tile {
  /** React 렌더링 키 및 CSS 트랜지션 식별용 고유 ID */
  public readonly id: string;
  /** 타일에 표시되는 숫자 값 (2, 4, 8, ..., 1024) */
  public value: number;
  /** 현재 행 위치 (0 ~ 3) */
  public row: number;
  /** 현재 열 위치 (0 ~ 3) */
  public col: number;
  /** 이동 애니메이션 계산을 위한 직전 행 위치 */
  public prevRow: number;
  /** 이동 애니메이션 계산을 위한 직전 열 위치 */
  public prevCol: number;
  /** 이번 턴에 병합되어 생성된 타일인지 여부 */
  public isMerged: boolean;
  /** 이번 턴에 새로 보드에 스폰된 타일인지 여부 */
  public isNew: boolean;

  /**
   * Tile 인스턴스 생성자
   * @param value 타일 숫자 값
   * @param row 행 좌표
   * @param col 열 좌표
   * @param id 선택적 고유 식별자 (미지정 시 무작위 ID 자동 생성)
   */
  constructor(value: number, row: number, col: number, id?: string) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.prevRow = row;
    this.prevCol = col;
    this.isMerged = false;
    this.isNew = true;
    this.id = id ?? `tile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 타일의 좌표를 갱신합니다.
   * 기존 좌표는 prevRow, prevCol에 보존되어 부드러운 이동 트랜지션을 가능하게 합니다.
   * @param newRow 새로운 행 좌표
   * @param newCol 새로운 열 좌표
   */
  public updatePosition(newRow: number, newCol: number): void {
    this.prevRow = this.row;
    this.prevCol = this.col;
    this.row = newRow;
    this.col = newCol;
  }

  /**
   * 턴 종료 후 신규/병합 플래그를 초기화합니다.
   */
  public resetAnimationFlags(): void {
    this.isMerged = false;
    this.isNew = false;
    this.prevRow = this.row;
    this.prevCol = this.col;
  }

  /**
   * 동일한 상태를 갖는 새로운 Tile 복제본을 생성합니다.
   */
  public clone(): Tile {
    const cloned = new Tile(this.value, this.row, this.col, this.id);
    cloned.prevRow = this.prevRow;
    cloned.prevCol = this.prevCol;
    cloned.isMerged = this.isMerged;
    cloned.isNew = this.isNew;
    return cloned;
  }
}
