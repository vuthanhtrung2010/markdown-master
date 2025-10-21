<script lang="ts">
	import { SvelteTheme } from 'svelte-themes';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Markdown Master - Advanced Markdown Editor</title>
	<meta name="description" content="A powerful, modern markdown editor with live preview" />
</svelte:head>

<SvelteTheme defaultTheme="system">
	{@render children()}
</SvelteTheme>
