# 1024 스페셜 챌린지 - v1.0.1 패치 노트 및 버그 분석 보고서

## 1. 문제 증상 요약
- 배포된 사이트(`https://jcodeonly.github.io/game-1024/`) 접속 후 초기 배치에서 두 타일이 나란히 있는 상태에서 오른쪽 방향키(`ArrowRight`)를 입력했을 때:
  - 새로운 타일(2)은 정상 생성되었으나, 우측 끝으로 이동한 타일이 4로 병합되지 않고 2로 남아있는 현상 발생.

## 2. 근본 원인 분석 (Root Cause Analysis)
1. **Next.js 정적 빌드(SSG) 시 무작위 타일 HTML 사전 생성 (Hydration Mismatch)**:
   - Next.js의 정적 빌드(`output: 'export'`) 과정에서 서버 사이드에서 `GameEngine`이 실행되어 난수로 생성된 2개의 타일이 정적 HTML(`out/index.html`)에 하드코딩되었습니다.
   - 브라우저가 정적 HTML을 로드했을 때 사용자는 빌드 시 생성된 타일을 먼저 보게 되었습니다.
   - 이후 클라이언트에서 React 하이드레이션이 일어나면서 새로운 `GameEngine` 인스턴스가 생성되었고, 클라이언트 엔진 내부에는 서버 HTML과 전혀 다른 위치의 무작위 타일이 배치되었습니다.
2. **React 상태와 엔진 보드 인스턴스 간 반응성 불일치**:
   - `GameContainer.tsx`에서 `tiles`가 React 상태(`useState`)로 분리되어 있지 않고, `board={engine.getBoard()}` 형태로 동일한 객체 레퍼런스가 전달되었습니다.
   - 첫 키 입력 전까지 클라이언트 엔진의 상태와 화면의 DOM이 어긋나 있었으며, 키 입력 시 클라이언트 엔진 내부 타일이 이동하고 새 타일이 생성되면서 화면에 불일치하게 갱신되었습니다.

## 3. 해결 방안 (Implementation)
1. **마운트 상태(`isMounted`) 도입을 통한 SSR/Client 불일치 원천 차단**:
   - `isMounted` 상태를 도입하여 클라이언트 마운트 이전(SSR 및 정적 HTML 생성 시)에는 타일 오버레이를 렌더링하지 않고 4x4 빈 격자 배경만 출력하도록 처리했습니다.
   - 클라이언트 브라우저에서 마운트가 완료된 직후(`useEffect`)에만 클라이언트 엔진의 타일을 렌더링하여 Hydration Mismatch를 100% 방지했습니다.
2. **불변(Immutable) `tiles` 상태 분리 및 반응형 바인딩**:
   - `GameContainer`에 `tiles: Tile[]` 상태를 추가하고, 이동(`handleMove`) 및 재시작(`handleNewGame`) 시 `engine.getBoard().getAllTiles().map(t => t.clone())`으로 불변 복제본을 전달하도록 수정했습니다.
   - `BoardView`에서 `tiles` prop을 직접 전달받아 렌더링하도록 확장하여 React 가상 DOM의 식별 및 업데이트가 안정적으로 이루어지도록 개선했습니다.

## 4. 검증 결과
- `BoardView` 및 `GameEngine` 단위 테스트 통과.
- `package.json` 버전을 `v1.0.1`로 상향.
