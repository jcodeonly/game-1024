/**
 * 메인 게임 페이지 (서버 컴포넌트 셸)
 * 서버 사이드 렌더링으로 페이지 뼈대를 신속하게 제공하고,
 * 하위 인터랙티브 게임 컴포넌트(GameContainer)를 비동기 클라이언트 컴포넌트로 마운트합니다.
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-black tracking-wider text-amber-400">1024 SPECIAL</h1>
        <p className="text-xs text-slate-400 mt-1">최소 이동 횟수 챌린지</p>
      </div>
    </main>
  );
}
