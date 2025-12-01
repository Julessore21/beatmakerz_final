/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const csp = [
      "default-src 'self';",
      "base-uri 'self';",
      "frame-ancestors 'self';",
      "img-src 'self' data: https:;",
      "media-src 'self' data: https:;",
      "font-src 'self' data: https:;",
      "style-src 'self' 'unsafe-inline' https:;",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;",
      `connect-src 'self' ${apiUrl} https:;`,
    ].join(" ");
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/abonnements",
        destination: "/web/abonnements",
        permanent: true,
      },
      {
        source: "/prodsurmesure",
        destination: "/web/prodsurmesure",
        permanent: true,
      },
      {
        source: "/tarification",
        destination: "/web/tarification",
        permanent: true,
      },
      {
        source: "/programmefidelite",
        destination: "/web/programmefidelite",
        permanent: true,
      },
      {
        source: "/cgu",
        destination: "/web/cgu",
        permanent: true,
      },
      {
        source: "/cgv",
        destination: "/web/cgv",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/web/faq",
        permanent: true,
      },
      {
        source: "/politique",
        destination: "/web/politique",
        permanent: true,
      },
      {
        source: "/mentions",
        destination: "/web/mentions",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/web/contact",
        permanent: true,
      },
      {
        source: "/cartecadeau",
        destination: "/web/cartes-cadeau",
        permanent: true,
      },
      {
        source: "/panier",
        destination: "/web/panier",
        permanent: true,
      },
      {
        source: "/profil",
        destination: "/web/profil",
        permanent: true,
      },
      {
        source: "/account",
        destination: "/web/account",
        permanent: true,
      },
      {
        source: "/marketplace",
        destination: "/web/marketplace",
        permanent: true,
      },
      {
        source: "/catalogue",
        destination: "/web/catalogue",
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
