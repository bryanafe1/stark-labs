/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Re-enable `experimental.typedRoutes` once the Arena / Learn / Practice /
  // Leaderboard / Community routes exist — until then it rejects nav links to
  // not-yet-created pages.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
