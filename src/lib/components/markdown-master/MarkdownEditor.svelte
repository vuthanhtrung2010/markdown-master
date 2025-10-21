<script lang="ts">
	import { getMarkdownContext } from './markdown-context.svelte.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';

	const ctx = getMarkdownContext();

	function handleSelect(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		const start = target.selectionStart;
		const end = target.selectionEnd;

		// Update selected text
		if (start !== end) {
			ctx.selectedText = target.value.substring(start, end);
		} else {
			ctx.selectedText = '';
		}

		// Always update cursor position to track where we are
		ctx.cursorPosition = { start, end };
	}

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLTextAreaElement;

		// Ctrl+B for bold
		if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
			e.preventDefault();
			ctx.insertMarkdown('bold', target);
			return;
		}

		// Ctrl+I for italic
		if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
			e.preventDefault();
			ctx.insertMarkdown('italic', target);
			return;
		}

		// Ctrl+U for underline
		if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
			e.preventDefault();
			ctx.insertMarkdown('underline', target);
			return;
		}

		// Tab to insert 4 spaces
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const text = target.value;
			const spaces = '    ';
			const newText = text.slice(0, start) + spaces + text.slice(end);
			ctx.markdown = newText;
			setTimeout(() => {
				target.selectionStart = target.selectionEnd = start + spaces.length;
			}, 0);
		}
	}
</script>

<Resizable.Pane defaultSize={50} minSize={30} class="overflow-hidden">
	<Textarea
		bind:value={ctx.markdown}
		onselect={handleSelect}
		onkeydown={handleKeyDown}
		onkeyup={handleSelect}
		onmousedown={handleSelect}
		onclick={handleSelect}
		onmousemove={(e) => e.buttons === 1 && handleSelect(e)}
		placeholder={ctx.config.placeholder || 'Write markdown here...'}
		class="md-editor h-full w-full resize-none overflow-auto rounded-none border-0 font-mono focus-visible:ring-0"
	/>
</Resizable.Pane>
