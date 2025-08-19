import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	output: 'export',
	basePath: '/Maping_prefabs',
	assetPrefix: '/Maping_prefabs',
	images: {
		unoptimized: true,
	},

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
