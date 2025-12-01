import type { NextConfig } from "next";

// Gunakan require agar aman dari error TypeScript modul
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Tambahkan reactStrictMode agar lebih stabil
  reactStrictMode: true, 
};

export default withPWA(nextConfig);