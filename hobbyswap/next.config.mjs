/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'hobbyswap-listings-images.s3.us-east-2.amazonaws.com',
  //       port: '',
  //       pathname: '/**',
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      // ✅ your real bucket host
      {
        protocol: "https",
        hostname: "hobbyswap-listings-images.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },

      // ✅ allow generic bucket style if your DB has this format
      {
        protocol: "https",
        hostname: "your-bucket.s3.amazonaws.com",
        pathname: "/**",
      },

      // ✅ (optional) allow path-style S3 URLs if any exist
      // https://s3.us-east-2.amazonaws.com/<bucket>/<key>
      {
        protocol: "https",
        hostname: "s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
