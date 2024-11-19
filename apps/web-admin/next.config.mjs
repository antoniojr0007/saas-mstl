/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' }, // Github
      { hostname: 'avatars.githubusercontent.com' }, // Github
      { hostname: 'lh3.googleusercontent.com' }, // Google
      { hostname: 'platform-lookaside.fbsbx.com' }, // Facebook
    ],
  },
}

export default nextConfig
