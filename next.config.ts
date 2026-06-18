import type { NextConfig } from "next";

// GitHub Pages 프로젝트 사이트(https://euneun9.github.io/test3/)로 배포하기 위한 설정.
// - output: "export"  → 정적 HTML/CSS/JS 만 생성 (서버 불필요)
// - basePath          → /test3 하위 경로로 서빙되므로 자산 경로 접두사 지정
// - trailingSlash     → 각 경로를 폴더/index.html 로 출력해 GitHub Pages 에서 안정적으로 서빙
const repoBasePath = "/test3";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  trailingSlash: true,
  images: {
    // 정적 export 에서는 기본 이미지 최적화를 쓸 수 없으므로 비활성화
    unoptimized: true,
  },
};

export default nextConfig;
