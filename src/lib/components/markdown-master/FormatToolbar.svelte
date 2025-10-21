<script lang="ts">
	import { getMarkdownContext } from './markdown-context.svelte.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		Bold,
		Italic,
		Strikethrough,
		Underline,
		Code,
		Heading1,
		Heading2,
		Heading3,
		List,
		ListOrdered,
		Quote,
		Link,
		Image as ImageIcon,
		Table as TableIcon,
		Sigma,
		Smile,
		Plus as PlusIcon,
		Trash as TrashIcon
	} from '@lucide/svelte';

	const ctx = getMarkdownContext();

	// Table Dialog
	let tableDialogOpen = $state(false);

	function insertMarkdownTable() {
		ctx.insertMarkdownTable();
		tableDialogOpen = false;
	}

	function copyMarkdownTable() {
		const markdown = ctx.generateMarkdownTable();
		navigator.clipboard.writeText(markdown);
	}

	// Emoji Dialog
	let emojiDialogOpen = $state(false);

	const emojis = [
		'😀',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'😂',
		'🤣',
		'😊',
		'😇',
		'🙂',
		'🙃',
		'😉',
		'😌',
		'😍',
		'🥰',
		'😘',
		'😗',
		'😙',
		'😚',
		'😋',
		'😛',
		'😝',
		'😜',
		'🤪',
		'🤨',
		'🧐',
		'🤓',
		'😎',
		'🤩',
		'🥳',
		'😏',
		'😒',
		'😞',
		'😔',
		'😟',
		'😕',
		'🙁',
		'☹️',
		'😣',
		'😖',
		'😫',
		'😩',
		'🥺',
		'😢',
		'😭',
		'😤',
		'😠',
		'😡',
		'🤬',
		'🤯',
		'😳',
		'🥵',
		'🥶',
		'😱',
		'😨',
		'😰',
		'😥',
		'😓',
		'🤗',
		'🤔',
		'🤭',
		'🤫',
		'🤥',
		'😶',
		'😐',
		'😑',
		'😬',
		'🙄',
		'😯',
		'😦',
		'😧',
		'😮',
		'😲',
		'🥱',
		'😴',
		'🤤',
		'😪',
		'😵',
		'🤐',
		'🥴',
		'🤢',
		'🤮',
		'🤧',
		'😷',
		'🤒',
		'🤕'
	];

	function insertEmoji(emoji: string) {
		ctx.insertMarkdown(`emoji-${emoji}`);
		emojiDialogOpen = false;
	}
</script>

<div class="mb-1 rounded-lg border bg-muted/40 p-1 shadow-sm sm:p-2">
	<div class="flex flex-wrap items-center justify-center gap-1">
		<!-- Text Formatting -->
		<div class="flex items-center gap-1 px-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant={ctx.activeFormats.bold ? 'default' : 'ghost'}
							size="sm"
							onclick={() => ctx.insertMarkdown('bold')}
						>
							<Bold class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Bold</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant={ctx.activeFormats.italic ? 'default' : 'ghost'}
							size="sm"
							onclick={() => ctx.insertMarkdown('italic')}
						>
							<Italic class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Italic</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant={ctx.activeFormats.strikethrough ? 'default' : 'ghost'}
							size="sm"
							onclick={() => ctx.insertMarkdown('strikethrough')}
						>
							<Strikethrough class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Strikethrough</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant={ctx.activeFormats.underline ? 'default' : 'ghost'}
							size="sm"
							onclick={() => ctx.insertMarkdown('underline')}
						>
							<Underline class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Underline</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<Separator orientation="vertical" class="h-8" />

		<!-- Lists and Quote -->
		<div class="flex items-center gap-1 px-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('list')}>
							<List class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Bullet List</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('ordered-list')}>
							<ListOrdered class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Numbered List</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('quote')}>
							<Quote class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Blockquote</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<Separator orientation="vertical" class="h-8" />

		<!-- Headings -->
		<div class="flex items-center gap-1 px-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('h1')}>
							<Heading1 class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Heading 1</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('h2')}>
							<Heading2 class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Heading 2</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('h3')}>
							<Heading3 class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Heading 3</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<Separator orientation="vertical" class="h-8" />

		<!-- Special Elements -->
		<div class="flex items-center gap-1 px-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							variant={ctx.activeFormats.code ? 'default' : 'ghost'}
							size="sm"
							onclick={() => ctx.insertMarkdown('code')}
						>
							<Code class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Code</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('math')}>
							<Sigma class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>LaTex</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('image')}>
							<ImageIcon class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Image</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm" onclick={() => ctx.insertMarkdown('link')}>
							<Link class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Link</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<Separator orientation="vertical" class="h-8" />

		<!-- Advanced Elements -->
		<div class="flex items-center gap-1 px-2">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Dialog.Root bind:open={tableDialogOpen}>
							<Dialog.Trigger>
								<Button variant="ghost" size="sm">
									<TableIcon class="h-4 w-4" />
								</Button>
							</Dialog.Trigger>
						</Dialog.Root>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Insert Table</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Dialog.Root bind:open={emojiDialogOpen}>
							<Dialog.Trigger>
								<Button variant="ghost" size="sm">
									<Smile class="h-4 w-4" />
								</Button>
							</Dialog.Trigger>
						</Dialog.Root>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Insert Emoji</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
	</div>
</div>

<!-- Table Dialog -->
<Dialog.Root bind:open={tableDialogOpen}>
	<Dialog.Content class="max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Insert Markdown Table</Dialog.Title>
			<Dialog.Description>
				Create a table by adding or removing rows and columns, then copy or insert the generated
				Markdown.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-2 items-center gap-4">
				<Button onclick={() => ctx.addTableRow()} variant="outline">
					<PlusIcon class="mr-2 h-4 w-4" />
					Add Row
				</Button>
				<Button onclick={() => ctx.addTableColumn()} variant="outline">
					<PlusIcon class="mr-2 h-4 w-4" />
					Add Column
				</Button>
			</div>
			<div class="max-h-[300px]">
				<table class="w-full">
					<tbody>
						{#each ctx.tableContent as row, rowIndex}
							<tr>
								{#each row as cell, colIndex}
									<td class="p-2">
										<Input
											value={cell}
											oninput={(e) =>
												ctx.updateTableCell(rowIndex, colIndex, e.currentTarget.value)}
											class="w-full"
										/>
									</td>
								{/each}
								<td class="p-2">
									<Button variant="ghost" size="sm" onclick={() => ctx.deleteTableRow(rowIndex)}>
										<TrashIcon class="h-4 w-4" />
									</Button>
								</td>
							</tr>
						{/each}
						<tr>
							{#each ctx.tableContent[0] as _, colIndex}
								<td class="p-2">
									<Button variant="ghost" size="sm" onclick={() => ctx.deleteTableColumn(colIndex)}>
										<TrashIcon class="h-4 w-4" />
									</Button>
								</td>
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
			<div class="flex justify-end space-x-2">
				<Button onclick={copyMarkdownTable} variant="outline">Copy Markdown</Button>
				<Button onclick={insertMarkdownTable}>Insert Table</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- Emoji Dialog -->
<Dialog.Root bind:open={emojiDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Insert Emoji</Dialog.Title>
			<Dialog.Description>
				Click on an emoji to insert it at the cursor position.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid max-h-[300px] grid-cols-8 gap-2 overflow-auto">
			{#each emojis as emoji}
				<Button variant="ghost" size="sm" onclick={() => insertEmoji(emoji)}>
					{emoji}
				</Button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
