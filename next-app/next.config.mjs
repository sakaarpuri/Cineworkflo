import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/vault',
        destination: '/prompts',
        permanent: true,
      },
      {
        source: '/vault/v2',
        destination: '/prompts',
        permanent: true,
      },
      {
        source: '/enhancer',
        destination: '/prompt-enhancer',
        permanent: true,
      },
      {
        source: '/library',
        destination: '/my-library',
        permanent: true,
      },
      {
        source: '/modern-moves',
        destination: '/camera-moves',
        permanent: true,
      },
      {
        source: '/camera-moves.html',
        destination: '/camera-moves',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
