# 1024 스페셜 게임 구현 계획 요약 (참조용)

본 문서는 `docs/superpowers/plans/2026-10-16-1024-special-game.md`의 구현 단계 참조본입니다.

## 작업 태스크 목록 및 브랜치/버전 맵핑

1. **Task 1: 프로젝트 스캐폴딩 및 개발 환경 구축**
   - 브랜치: `feat/scaffold-setup` -> `main` 병합 (`v0.1.0`)
   - Next.js (App Router) + TypeScript + Tailwind CSS + Vitest 환경

2. **Task 2: 핵심 OOP 게임 엔진 구현 (`Tile`, `Board`, `GameEngine`)**
   - 브랜치: `feat/game-engine` -> `main` 병합 (`v0.2.0`)
   - 슬라이드/병합 알고리즘, 100턴 90도 회전 공식 `(row, col) -> (col, 3 - row)`, 1024 즉시 승리 판정

3. **Task 3: 보드 및 타일 렌더링 UI 컴포넌트 (`BoardView`, `TileView`)**
   - 브랜치: `feat/board-ui` -> `main` 병합 (`v0.3.0`)
   - 4x4 반응형 그리드, 숫자 텍스트 정방향(0°) 유지 역회전 트랜지션

4. **Task 4: 아케이드 스탯 헤더 및 100턴 회전 게이지 (`HeaderStats`, `RotationGauge`)**
   - 브랜치: `feat/rotation-gauge` -> `main` 병합 (`v0.4.0`)
   - 이동 횟수(Moves) 대형 표시, 다음 회전까지 남은 횟수 게이지 바

5. **Task 5: 사용자 입력 제스처 훅 및 게임 컨테이너 통합 (`useGameInput`, `GameContainer`)**
   - 브랜치: `feat/controls-gesture` -> `main` 병합 (`v0.5.0`)
   - 모바일 스와이프 (`touch-action: none` 스크롤 방지), 키보드 방향키/WASD 지원

6. **Task 6: 결과 모달, 로컬스토리지 영속화 및 Firebase 호스팅 설정**
   - 브랜치: `feat/modals-persistence` -> `main` 병합 (`v1.0.0`)
   - 1024 승리 모달, 게임 오버 모달, 최고 기록(최소 이동 수) 로컬스토리지 저장, Firebase 배포 구성
