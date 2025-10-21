<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	import MarkdownMaster from '$lib/components/markdown-master/MarkdownMaster.svelte';
	import {
		getMarkdownContext,
		type MarkdownMasterConfig
	} from '$lib/components/markdown-master/markdown-context.svelte.js';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';

	// Success dialog state
	let showSuccessDialog = $state(false);

	// Local storage key for persisting content
	const localStorageKey = 'md-master:demo:description';

	// Markdown Master configuration
	const markdownConfig: MarkdownMasterConfig = {
		title: 'Local Markdown Demo',
		initialContent: '',
		placeholder: 'Write your markdown here…',
		showTitle: true
	};

	// Context reference - will be bound from MarkdownMaster component
	let formElement: HTMLFormElement | null = $state(null);
	let markdownContext = $state<ReturnType<typeof getMarkdownContext>>();

	// Load initial content from localStorage on mount
	onMount(() => {
		if (!browser) return;
		try {
			const saved = localStorage.getItem(localStorageKey);
			if (saved != null && markdownContext) {
				markdownContext.markdown = saved;
				markdownContext.savedContent = saved;
			}
		} catch (e) {
			// Ignore storage errors
			console.error('Failed to read from localStorage', e);
		}
	});

	function loadFromLocal() {
		if (!browser || !markdownContext) return;
		const saved = localStorage.getItem(localStorageKey);
		if (saved != null) {
			markdownContext.markdown = saved;
			markdownContext.savedContent = saved;
		}
	}

	function clearSaved() {
		if (!browser || !markdownContext) return;
		localStorage.removeItem(localStorageKey);
	}
</script>

<div class="container mx-auto flex h-screen flex-col py-8">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<h1 class="text-3xl font-bold">Markdown Master – Local Demo</h1>
			<p class="text-muted-foreground">Edit markdown and save/load using local storage</p>
		</div>
		<ThemeToggle />
	</div>

	<!-- Extra local actions -->
	<div class="mb-4 flex flex-wrap gap-2">
		<Button variant="outline" onclick={loadFromLocal}>Load from Local Storage</Button>
		<Button variant="outline" onclick={clearSaved}>Clear Saved</Button>
	</div>

	<form
		bind:this={formElement}
		method="POST"
		action="?/save"
		use:enhance={({ cancel }) => {
			// Intercept submission and save to localStorage instead of server
			if (!markdownContext) {
				cancel();
				return;
			}

			try {
				if (browser) {
					localStorage.setItem(localStorageKey, markdownContext.markdown);
				}
				// Mark as saved in context
				markdownContext.savedContent = markdownContext.markdown;
				// Show success dialog
				showSuccessDialog = true;
			} catch (e) {
				console.error('Failed to save to localStorage', e);
			}

			// No server roundtrip; prevent default handling
			cancel();

			// Return a noop result handler to satisfy enhance contract
			return () => {};
		}}
		class="flex flex-1 flex-col overflow-hidden"
	>
		<div class="flex flex-1 flex-col overflow-hidden rounded-lg border">
			<MarkdownMaster config={markdownConfig} showTitle={true} bind:contextRef={markdownContext} />
		</div>
	</form>
</div>

<!-- Success Dialog -->
<Dialog.Root bind:open={showSuccessDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Saved Successfully</Dialog.Title>
			<Dialog.Description>Markdown has been saved to local storage.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="mt-4 flex gap-2">
			<Button variant="outline" onclick={() => (showSuccessDialog = false)}>Continue Editing</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
