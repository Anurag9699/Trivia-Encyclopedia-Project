/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
    },
    // Suppress Three.js SSR warnings
    webpack: (config) => {
        config.externals = config.externals || [];
        return config;
    },
};

export default nextConfig;
