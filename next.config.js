/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
};
module.exports = nextConfig;
module.exports = nextConfig;

// next.config.js
module.exports = {
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

      // ... idem pour contact, catalogue, etc.
    ];
  },
};
