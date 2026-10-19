/**
 * 최저 이동 횟수(Personal Best) 로컬스토리지 관리 유틸리티
 */

const STORAGE_KEY = "game1024_best_moves";

/**
 * 저장된 최저 이동 횟수를 반환합니다.
 * 기록이 없거나 조회 실패 시 null을 반환합니다.
 */
export function getBestMoves(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * 새로운 이동 횟수를 기록과 비교하여 더 우수한(더 적은) 기록일 경우 갱신 저장합니다.
 * @param currentMoves 이번 게임의 최종 이동 횟수
 * @returns 갱신 여부(신비기록이면 true) 및 최저 이동 횟수
 */
export function saveBestMoves(currentMoves: number): { isNewRecord: boolean; bestMoves: number } {
  const currentBest = getBestMoves();
  if (currentBest === null || currentMoves < currentBest) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, currentMoves.toString());
      } catch {}
    }
    return { isNewRecord: true, bestMoves: currentMoves };
  }
  return { isNewRecord: false, bestMoves: currentBest };
}

/**
 * 기록 초기화 유틸리티 (테스트 또는 리셋용)
 */
export function clearBestMoves(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}
