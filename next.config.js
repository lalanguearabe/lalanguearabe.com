/** @type {import('next').NextConfig} */
// Suppression de la configuration PWA
const nextConfig = {
  // Ajout de output: 'export' pour générer une version statique
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

