/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 추후 Firebase 정적 호스팅 또는 SSR 유연성을 위한 설정
  output: process.env.NEXT_EXPORT ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
