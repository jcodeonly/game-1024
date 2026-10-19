import { GameContainer } from "@/components/GameContainer";

/**
 * 메인 게임 페이지 (서버 컴포넌트 셸)
 * 서버 사이드에서 기본 레이아웃 셸을 신속히 렌더링하고,
 * 유저 인터랙션이 발생하는 게임 보드(GameContainer)를 클라이언트 컴포넌트로 전달합니다.
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full">
      <GameContainer />
    </main>
  );
}
