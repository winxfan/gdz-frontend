const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
	openAnalyzer: process.env.ANALYZE_OPEN !== 'false',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		formats: ['image/avif', 'image/webp'],
	},
};

module.exports = withBundleAnalyzer(nextConfig);




