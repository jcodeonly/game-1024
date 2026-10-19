# 1024 스페셜 게임 배포 가이드 (참고자료)

본 문서는 GitHub Pages 및 Firebase Hosting 배포 절차를 안내합니다.

## 1. GitHub Pages 배포 (자동화 완료)
- GitHub Actions 워크플로우가 `.github/workflows/deploy.yml`에 설정되어 있습니다.
- `main` 브랜치에 코드가 push되면 자동으로 테스트 실행 -> Next.js 정적 빌드(`out`) -> GitHub Pages 배포가 진행됩니다.
- 저장소 설정(`Settings` > `Pages`)에서 **Source: GitHub Actions**로 설정하면 `https://jcodeonly.github.io/game-1024/` 주소로 즉시 접근 및 플레이 가능합니다.

## 2. Firebase Hosting 배포
- 설정 파일: `firebase.json`, `.firebaserc`
- 빌드 명령어: `npm run build` (결과물은 `out/` 폴더에 생성)
- 배포 명령어: `npx firebase deploy --only hosting`

## 3. 핵심 룰 및 컴포넌트 구조
- **경쟁 지표**: 누적 점수가 아닌 **최소 이동 횟수(Moves)** (낮을수록 우수)
- **승리 조건**: 1024 타일 생성 즉시 승리 팝업 및 최저 기록 갱신
- **100턴 회전 기믹**: 100회 이동마다 보드 시계방향 90도 회전 (타일 숫자는 역회전하여 0도 정방향 유지)
- **외부 임베드 호환**: `<GameContainer />` 컴포넌트 단독으로 다른 서비스의 하위 모듈, 모달, 위젯으로 완벽 임베드 가능
