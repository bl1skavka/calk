import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

// Set automatically by the GitHub Actions workflow to "/<repo-name>" so the
// site works when hosted at https://<username>.github.io/<repo-name>/.
// Stays empty for local development (npm run dev / npm start).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Service workers are finicky with static export + a basePath, and this
  // app doesn't need offline support, so keep it simple and disabled.
  disable: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  // Static export: produces a plain HTML/CSS/JS "out" folder that GitHub
  // Pages (or any static host) can serve directly, no Node.js server needed.
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // next/image's optimization API needs a server; static export has none.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default pwaConfig(nextConfig);
