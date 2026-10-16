import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RotationGauge } from "@/components/RotationGauge";
import { HeaderStats } from "@/components/HeaderStats";

describe("RotationGauge 및 HeaderStats 컴포넌트", () => {
  it("RotationGauge는 남은 회전 횟수를 정확히 표시해야 한다", () => {
    render(<RotationGauge remainingMoves={42} totalInterval={100} />);
    expect(screen.getByText("42회 남음")).toBeInTheDocument();
    expect(screen.getByText(/90° 회전까지/)).toBeInTheDocument();
  });

  it("RotationGauge는 남은 이동 횟수에 따른 퍼센트(58%)를 게이지 너비로 설정해야 한다", () => {
    const { container } = render(<RotationGauge remainingMoves={42} totalInterval={100} />);
    const progressBar = container.querySelector(".gauge-progress-bar");
    expect(progressBar).not.toBeNull();
    // 100 - 42 = 58% 진행
    expect(progressBar?.getAttribute("style")).toContain("width: 58%");
  });

  it("HeaderStats는 현재 이동 횟수와 최고 기록(최소 이동)을 정확히 표시해야 한다", () => {
    render(<HeaderStats moves={58} bestMoves={42} onNewGame={() => {}} />);
    expect(screen.getByText("58")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("STAGE 1024")).toBeInTheDocument();
  });

  it("HeaderStats에서 bestMoves가 null일 경우 '-'로 표시해야 한다", () => {
    render(<HeaderStats moves={12} bestMoves={null} onNewGame={() => {}} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
