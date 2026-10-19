import { describe, it, expect, beforeEach } from "vitest";
import { getBestMoves, saveBestMoves, clearBestMoves } from "@/utils/storage";

describe("storage 유틸리티 (최저 이동 횟수 로컬스토리지 영속화)", () => {
  beforeEach(() => {
    clearBestMoves();
  });

  it("초기 상태에서는 getBestMoves()가 null을 반환해야 한다", () => {
    expect(getBestMoves()).toBeNull();
  });

  it("첫 기록 저장 시 신기록(isNewRecord: true)으로 저장되어야 한다", () => {
    const result = saveBestMoves(75);
    expect(result.isNewRecord).toBe(true);
    expect(result.bestMoves).toBe(75);
    expect(getBestMoves()).toBe(75);
  });

  it("더 적은 횟수(우수한 기록)로 클리어 시 신기록으로 갱신되어야 한다", () => {
    saveBestMoves(80);
    const result = saveBestMoves(62);
    expect(result.isNewRecord).toBe(true);
    expect(result.bestMoves).toBe(62);
    expect(getBestMoves()).toBe(62);
  });

  it("기존 기록보다 더 많은 이동 횟수는 갱신되지 않아야 한다", () => {
    saveBestMoves(62);
    const result = saveBestMoves(90);
    expect(result.isNewRecord).toBe(false);
    expect(result.bestMoves).toBe(62);
    expect(getBestMoves()).toBe(62);
  });
});
