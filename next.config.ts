import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com","www.google.com"], //  Allow Cloudinary images
  },
};

export default nextConfig;
