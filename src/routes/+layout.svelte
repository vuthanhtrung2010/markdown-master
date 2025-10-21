<script lang="ts">
	import { SvelteTheme } from 'svelte-themes';
	import '../app.css';

	let { children } = $props();
</script>

<SvelteTheme defaultTheme="system">
	{@render children()}
</SvelteTheme>
