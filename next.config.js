const dotenv = require("dotenv");

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    OFFICIAL: process.env["OFFICIAL_BUILD"] ?? "false"
  }
}

module.exports = nextConfig
