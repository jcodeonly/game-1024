/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

const basePath = isGithubActions && repoName ? `/${repoName}` : (process.env.NEXT_PUBLIC_BASE_PATH || '');

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 및 Firebase 정적 호스팅을 위한 static export 설정
  output: 'export',
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
