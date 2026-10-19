import { describe, it, expect } from "vitest";
import { getDirectionFromSwipe, getDirectionFromKey } from "@/hooks/useGameInput";
import type { Direction } from "@/game/types";

describe("useGameInput 유틸리티 함수", () => {
  describe("getDirectionFromSwipe: 터치 스와이프 방향 판정", () => {
    it("충분한 수평 오른쪽 스와이프(dx > 30)를 RIGHT로 판정해야 한다", () => {
      expect(getDirectionFromSwipe(50, 5)).toBe("RIGHT");
    });

    it("충분한 수평 왼쪽 스와이프(dx < -30)를 LEFT로 판정해야 한다", () => {
      expect(getDirectionFromSwipe(-50, 5)).toBe("LEFT");
    });

    it("충분한 수직 아래 스와이프(dy > 30)를 DOWN으로 판정해야 한다", () => {
      expect(getDirectionFromSwipe(5, 50)).toBe("DOWN");
    });

    it("충분한 수직 위 스와이프(dy < -30)를 UP으로 판정해야 한다", () => {
      expect(getDirectionFromSwipe(5, -50)).toBe("UP");
    });

    it("30px 미만의 미세한 움직임은 null을 반환해야 한다 (무시)", () => {
      expect(getDirectionFromSwipe(10, 10)).toBeNull();
      expect(getDirectionFromSwipe(0, 0)).toBeNull();
    });

    it("사선 스와이프는 더 긴 축 방향으로 판정해야 한다", () => {
      // dx=60, dy=30 → x축이 더 길므로 RIGHT
      expect(getDirectionFromSwipe(60, 30)).toBe("RIGHT");
      // dx=20, dy=40 → y축이 더 길므로 DOWN
      expect(getDirectionFromSwipe(20, 40)).toBe("DOWN");
    });
  });

  describe("getDirectionFromKey: 키보드 키 매핑", () => {
    const cases: Array<[string, Direction]> = [
      ["ArrowUp", "UP"],
      ["ArrowDown", "DOWN"],
      ["ArrowLeft", "LEFT"],
      ["ArrowRight", "RIGHT"],
      ["KeyW", "UP"],
      ["KeyS", "DOWN"],
      ["KeyA", "LEFT"],
      ["KeyD", "RIGHT"],
    ];

    it.each(cases)("'%s' 키는 '%s' 방향으로 매핑되어야 한다", (key, expected) => {
      expect(getDirectionFromKey(key)).toBe(expected);
    });

    it("미지원 키는 null을 반환해야 한다", () => {
      expect(getDirectionFromKey("Space")).toBeNull();
      expect(getDirectionFromKey("Enter")).toBeNull();
    });
  });
});
