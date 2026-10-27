import type { NextConfig } from "next";



/** @type {import('next').NextConfig} */
const nextConfig = {
  // ເພີ່ມ IP Address ຂອງທ່ານໃສ່ບ່ອນນີ້
  allowedDevOrigins: ['10.200.10.36'],
};

module.exports = nextConfig;

export default nextConfig;
