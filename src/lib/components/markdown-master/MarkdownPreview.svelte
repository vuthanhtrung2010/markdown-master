<script lang="ts">
	import { getMarkdownContext } from './markdown-context.svelte.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { processMarkdownToHtml } from '$lib/markdown-processor.js';
	import 'katex/dist/katex.min.css';

	const ctx = getMarkdownContext();
	let rendered = $state<string>('');

	$effect(() => {
		const markdown = ctx.markdown;
		processMarkdownToHtml(markdown).then((html) => {
			rendered = html;
		});
	});
</script>

<Resizable.Pane defaultSize={50} minSize={30} class="overflow-hidden">
	<div class="md-preview h-full w-full overflow-y-auto p-4">
		<div
			class="prose prose-sm dark:prose-invert markdown-rendered content-description problemProse max-w-none"
		>
			{@html rendered}
		</div>
	</div>
</Resizable.Pane>

<style>
	:global(.problemProse h3 code) {
		font-size: 1.125rem;
	}

	:global(.problemProse pre) {
		padding-left: 0;
		padding-right: 0;
		border-radius: 0.5rem;
		overflow-x: auto;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	:global(.problemProse pre [data-line]) {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	:global(.problemProse code) {
		font-size: 0.875rem;
		line-height: 1.75;
	}

	:global(.problemProse pre > code) {
		counter-reset: line;
	}

	:global(.problemProse pre code[data-theme]),
	:global(.problemProse pre code[data-theme] span) {
		color: var(--shiki-light);
		background-color: var(--shiki-light-bg);
	}

	@media (prefers-color-scheme: dark) {
		:global(.problemProse pre code[data-theme]),
		:global(.problemProse pre code[data-theme] span) {
			color: var(--shiki-dark);
			background-color: var(--shiki-dark-bg);
		}
	}
</style>
