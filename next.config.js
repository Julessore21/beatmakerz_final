/** @type {import('next').NextConfig} */
const nextConfig = {};

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

      // ... idem pour contact, catalogue, etc.
    ];
  },
};
