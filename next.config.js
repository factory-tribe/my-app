// Import polyfills for Cloudflare Workers environment
import "./polyfills.js"

import { withPayload } from "@payloadcms/next/withPayload"
import checkEnvVariables from "./check-env-variables.js"
import redirects from './redirects.js'

checkEnvVariables()

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: 'http',
        hostname: '*.next',
        port: '3000',
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
              protocol: "https",
              hostname: "lsxbwigpsqytehupjass.supabase.co",
            },
            {
              protocol: "https",
              hostname: "ooghhczrlluskstysujn.supabase.co",
            },
      {
              protocol: "https",
              hostname: "assets.myntassets.com",
    },
    ],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
      // Country-based routes (e.g., /in, /us, /uk)
      {
        source: '/:countryCode',
        destination: '/:countryCode',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
      {
        source: '/:countryCode/:path*',
        destination: '/:countryCode/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
      // Tenant CMS routes (e.g., /faq, /about)
      {
        source: '/:slug',
        destination: '/tenant/:slug',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
    ]
  },

}

export default withPayload(nextConfig)