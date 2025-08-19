import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	output: 'export',
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	basePath: process.env.NODE_ENV === 'production' ? '/Maping_prefabs' : '',
	assetPrefix: process.env.NODE_ENV === 'production' ? '/Maping_prefabs/' : '',

	// yaml importing
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.yaml/,
			use: 'js-yaml-loader',
		})
		return config
	},
}

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
})

export default withMDX(nextConfig)
