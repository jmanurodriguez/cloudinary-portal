import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Forzar Node.js runtime para el middleware (evita Edge Runtime con Clerk)
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
