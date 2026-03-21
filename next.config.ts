import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Heroku deployment: listen on $PORT
  ...(process.env.PORT
    ? {
        serverExternalPackages: ["@neondatabase/serverless"],
      }
    : {}),
};

export default nextConfig;
