# 1024 스페셜 게임 (1024 Special Challenge) 설계 참고 문서

본 문서는 `docs/superpowers/specs/2026-10-16-1024-special-game-design.md`의 핵심 설계 참조본입니다.

## 1. 프로젝트 주요 설정
- 언어: TypeScript (Strict)
- 프레임워크: Next.js (App Router, SSR 셸 + `"use client"` 상호작용 컴포넌트)
- CSS: Tailwind CSS (모바일 반응형 + 다크 아케이드 테마)
- 배포: Firebase (Firebase App Hosting / Hosting)
- Git: https://github.com/jcodeonly
  - 컴포넌트 단위 기능 브랜치 (`feat/*`) 분기
  - 검토 후 `main`에 병합
  - 병합 시마다 버전 숫자 증가 (`v0.1.0` -> `v0.2.0` 등)

## 2. 특별 룰
1. **경쟁 기준**: 점수제가 아닌 **최소 이동 횟수(Move Count)**
2. **승리 조건**: 1024 타일 생성 즉시 승리 모달 노출 및 최종 이동 횟수 기록
3. **100턴 회전 기믹**: 100회 이동마다 보드 전체가 시계방향으로 90도 회전
   - 타일 위치: `(row, col) -> (col, 3 - row)`
   - 타일 숫자: 사용자가 보기 편하도록 원래 정방향(0°) 유지
   - 다음 회전까지 남은 이동 수 게이지 바(Warning Progress Bar) 표시

## 3. 핵심 OOP 클래스 구조
- `Tile`: ID, 값, 위치(row, col), 이전 위치(prevRow, prevCol), 상태 플래그
- `Board`: 4x4 매트릭스 슬라이드, 병합, 90도 회전, 빈 셀 탐색, 이동 가능 여부 판정
- `GameEngine`: 상태 머신(PLAYING, WON, GAME_OVER), 100턴 회전 주기 제어, 승리/패배 판정
