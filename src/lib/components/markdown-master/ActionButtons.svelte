<script lang="ts">
	import { onMount } from 'svelte';
	import { getMarkdownContext } from './markdown-context.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Save, Copy, Trash2 } from '@lucide/svelte';

	interface Props {
		showTitle?: boolean;
	}

	let { showTitle = true }: Props = $props();

	const ctx = getMarkdownContext();
	let clearDialogOpen = $state(false);
	let copyDialogOpen = $state(false);

	// Handle copy to clipboard with dialog notification
	function handleCopy() {
		ctx.copyToClipboard();
		copyDialogOpen = true;
	}

	// Handle clear document with confirmation
	function handleClearDocument() {
		ctx.clearMarkdown();
		clearDialogOpen = false;
	}

	// Keyboard shortcut for save (Ctrl+S / Cmd+S)
	onMount(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				event.preventDefault();
				// Trigger form submission
				const form = document.querySelector('form[action="?/save"]') as HTMLFormElement;
				if (form) {
					form.requestSubmit();
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div class="mb-1">
	<div
		class="flex flex-wrap items-center gap-1 rounded-lg bg-muted/30 p-1 shadow-sm sm:gap-2 sm:p-2"
	>
		<!-- Document Actions Group -->
		<div class="flex items-center">
			<!-- Quick Save Button -->
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button type="submit" variant="outline" size="sm" class="rounded-r-none border-r-0">
							<Save class="mr-2 h-4 w-4" />
							Save{ctx.hasUnsavedChanges ? '*' : ''}
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Save the current problem description</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							onclick={handleCopy}
							variant="outline"
							size="sm"
							class="rounded-l-none rounded-r-none"
						>
							<Copy class="mr-2 h-4 w-4" />
							Copy
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Copy markdown to clipboard</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Dialog.Root bind:open={clearDialogOpen}>
							<Dialog.Trigger>
								<Button
									variant="outline"
									size="sm"
									class="rounded-l-none text-destructive hover:text-destructive"
								>
									<Trash2 class="mr-2 h-4 w-4" />
									Clear
								</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Clear Document</Dialog.Title>
									<Dialog.Description>
										Are you sure you want to clear the current document? This action cannot be
										undone.
									</Dialog.Description>
								</Dialog.Header>
								<Dialog.Footer class="mt-4">
									<Button variant="outline" onclick={() => (clearDialogOpen = false)}>
										Cancel
									</Button>
									<Button variant="destructive" onclick={handleClearDocument}>
										Clear Document
									</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Clear the current document</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<!-- Separator between buttons and problem name -->
		<div class="mx-4 h-8 w-px bg-border"></div>

		<!-- Title display -->
		{#if showTitle && ctx.config.title}
			<div class="flex items-center rounded-md border bg-background px-2 py-1">
				<span class="text-sm font-medium text-foreground">{ctx.config.title}</span>
			</div>
		{/if}
	</div>
</div>

<!-- Copy Success Dialog -->
<Dialog.Root bind:open={copyDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Copied</Dialog.Title>
			<Dialog.Description>Problem description copied to clipboard.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="mt-4">
			<Button variant="outline" onclick={() => (copyDialogOpen = false)}>OK</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
