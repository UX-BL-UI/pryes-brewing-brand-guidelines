import type { NextConfig } from "next";

// Deployed as a GitHub Pages *project* site:
//   https://ux-bl-ui.github.io/pryes-brewing-brand-guidelines/
// so every route/asset is served under this base path. When the site later
// moves to its own domain (off SquareSpace), set BASE_PATH="" and all URLs
// collapse to root with no other code changes -- the seamless-migration hook.
const basePath = process.env.BASE_PATH ?? "/pryes-brewing-brand-guidelines/homepage";

const nextConfig: NextConfig = {
  output: "export", // fully static HTML/CSS/JS, hostable on any static host
  basePath,
  trailingSlash: true, // /visit -> /visit/index.html, stable URLs for SEO
  images: { unoptimized: true }, // no image server on a static host
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
