import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNetlify from '@sveltejs/adapter-netlify';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */

// Detect environment or let user override with ADAPTER env var
const env =
	process.env.ADAPTER ||
	(process.env.VERCEL
		? 'vercel'
		: process.env.NETLIFY
			? 'netlify'
			: process.env.CLOUDFLARE_PAGES
				? 'cloudflare'
				: process.versions?.bun
					? 'bun'
					: 'bun');

// Map environments to adapters
const adapters = {
	bun: adapterNode({ out: 'build' }), // Bun acts like Node
	node: adapterNode({ out: 'build' }),
	static: adapterStatic({ pages: 'build', assets: 'build' }),
	vercel: adapterVercel(),
	netlify: adapterNetlify(),
	cloudflare: adapterCloudflare()
};

// Default fallback: Node adapter (Bun-compatible)
const adapter = adapters[env] || adapters.bun;

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter
	}
};

export default config;
