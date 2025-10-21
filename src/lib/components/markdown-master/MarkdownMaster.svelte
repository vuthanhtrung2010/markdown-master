<script lang="ts">
	import {
		setMarkdownContext,
		type MarkdownMasterConfig,
		type MarkdownMasterContext
	} from './markdown-context.svelte.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import ActionButtons from './ActionButtons.svelte';
	import FormatToolbar from './FormatToolbar.svelte';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import MarkdownPreview from './MarkdownPreview.svelte';

	interface Props {
		config: MarkdownMasterConfig;
		showTitle?: boolean;
		contextRef?: MarkdownMasterContext;
	}

	let { config, showTitle = true, contextRef = $bindable() }: Props = $props();

	const ctx = setMarkdownContext(config);

	// Expose context to parent component
	contextRef = ctx;
</script>

<div class="flex h-full flex-col">
	<!-- Fixed header with action buttons and toolbar -->
	<div class="flex-none">
		<ActionButtons {showTitle} />
		<FormatToolbar />
	</div>

	<!-- Desktop: Horizontal layout (side by side) -->
	<div class="hidden flex-1 overflow-hidden lg:flex">
		<Resizable.PaneGroup direction="horizontal" class="h-full w-full">
			<MarkdownEditor />
			<Resizable.Handle withHandle />
			<MarkdownPreview />
		</Resizable.PaneGroup>
	</div>

	<!-- Mobile: Vertical layout (stacked) -->
	<div class="flex flex-1 flex-col overflow-hidden lg:hidden">
		<Resizable.PaneGroup direction="vertical" class="h-full w-full">
			<MarkdownEditor />
			<Resizable.Handle withHandle />
			<MarkdownPreview />
		</Resizable.PaneGroup>
	</div>
</div>
