const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://accounts.google.com https://www.google.com https://www.recaptcha.net https://recaptcha.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com https://unpkg.com; img-src 'self' data: https: *.googleusercontent.com; font-src 'self' data: https://fonts.gstatic.com https://unpkg.com; connect-src 'self' https: wss: *.googleapis.com *.firebaseio.com *.cloudfunctions.net https://unpkg.com; frame-src https://accounts.google.com https://*.firebaseapp.com https://www.google.com https://www.recaptcha.net https://recaptcha.net; frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
