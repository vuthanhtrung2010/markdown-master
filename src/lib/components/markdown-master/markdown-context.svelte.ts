/**
 * Markdown Master Context Store
 * Manages state for markdown editing, formatting, theming, and table generation
 */

import { getContext, setContext } from 'svelte';

export interface MarkdownMasterConfig {
	title: string;
	titleKey?: string | null;
	initialContent: string;
	sessionToken?: string;
	placeholder?: string;
	showTitle?: boolean;
}

const CONTEXT_KEY = Symbol('markdown-master');

export class MarkdownMasterContext {
	// Content state
	markdown = $state('');
	savedContent = $state('');
	selectedText = $state('');
	cursorPosition = $state<{ start: number; end: number }>({ start: 0, end: 0 });
	hasUnsavedChanges = $derived(this.savedContent !== this.markdown);

	// UI state
	theme = $state('light');
	fontSize = $state('16');
	lineHeight = $state('1.5');
	fontFamily = $state('inter');
	syntaxTheme = $state('tomorrow');

	// Table state
	tableRows = $state(2);
	tableCols = $state(2);
	tableContent = $state<string[][]>([
		['', ''],
		['', '']
	]);

	// Dialog state
	showSaveDialog = $state(false);
	showClearDialog = $state(false);
	showCopyDialog = $state(false);

	// Active formats tracking
	activeFormats = $state<Record<string, boolean>>({});

	// Configuration
	config: MarkdownMasterConfig;

	constructor(config: MarkdownMasterConfig) {
		this.config = config;
		this.markdown = config.initialContent;
		this.savedContent = config.initialContent;

		// Watch for theme changes
		$effect(() => {
			if (typeof document !== 'undefined') {
				document.body.className = this.theme;
				document.documentElement.style.setProperty('--font-size', `${this.fontSize}px`);
				document.documentElement.style.setProperty('--line-height', this.lineHeight);
				document.documentElement.style.setProperty('--font-family', this.fontFamily);
			}
		});

		// Detect active formats when selection changes
		$effect(() => {
			if (!this.selectedText.trim()) {
				this.activeFormats = {};
				return;
			}

			const formats: Record<string, boolean> = {};
			const sel = this.selectedText;

			// Check for bold
			formats.bold =
				/^\*\*.*\*\*$/.test(sel) ||
				/^\*\*\*.*\*\*\*$/.test(sel) ||
				/\*\*.*\*\*/.test(sel) ||
				/\*\*\*.*\*\*\*/.test(sel);

			// Check for italic
			const startsWithSingleAsterisk = sel.startsWith('*') && !sel.startsWith('**');
			const endsWithSingleAsterisk = sel.endsWith('*') && !sel.endsWith('**');
			const startsWithSingleUnderscore = sel.startsWith('_') && !sel.startsWith('__');
			const endsWithSingleUnderscore = sel.endsWith('_') && !sel.endsWith('__');
			const isCombinedAsterisks = /^\*\*\*.*\*\*\*$/.test(sel) || /\*\*\*.*\*\*\*/.test(sel);
			const containsItalicPatterns =
				(/\*.*\*/.test(sel) && !/\*\*.*\*\*/.test(sel)) ||
				(/_.*_/.test(sel) && !/__.*__/.test(sel));

			formats.italic =
				(startsWithSingleAsterisk && endsWithSingleAsterisk) ||
				(startsWithSingleUnderscore && endsWithSingleUnderscore) ||
				isCombinedAsterisks ||
				containsItalicPatterns;

			// Check for strikethrough
			formats.strikethrough = /^~~.*~~$/.test(sel) || /~~.*~~/.test(sel);

			// Check for underline
			formats.underline =
				/^__.*__$/.test(sel) || /^\*\*__.*__.*\*\*$/.test(sel) || /__.*__/.test(sel);

			// Check for code
			formats.code = /^`.*`$/.test(sel) || /`.*`/.test(sel);

			this.activeFormats = formats;
		});
	}

	insertMarkdown(format: string, textarea?: HTMLTextAreaElement) {
		const ta = textarea || (document.querySelector('textarea') as HTMLTextAreaElement);
		if (!ta) return;

		const start = ta.selectionStart;
		const end = ta.selectionEnd;
		const text = ta.value;
		let insertion = '';
		let cursorOffset = 0;
		let shouldRemove = false;

		// Check if format is already active and should be removed
		if (start !== end) {
			const selectedText = text.slice(start, end);
			switch (format) {
				case 'bold':
					if (/^\*\*\*.*\*\*\*$/.test(selectedText)) {
						shouldRemove = true;
						insertion = `*${selectedText.slice(3, -3)}*`;
					} else if (/^\*\*__.*__.*\*\*$/.test(selectedText)) {
						shouldRemove = true;
						const innerText = selectedText.slice(4, -4);
						insertion = `__${innerText}__`;
					} else if (/\*\*\*.*\*\*\*/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/\*\*\*(.*?)\*\*\*/g, '*$1*');
					} else if (/\*\*.*\*\*/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/\*\*(.*?)\*\*/g, '$1');
					} else if (/^\*\*.*\*\*$/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.slice(2, -2);
					}
					break;
				case 'italic': {
					const italicStartsWithSingle =
						selectedText.startsWith('*') && !selectedText.startsWith('**');
					const italicEndsWithSingle = selectedText.endsWith('*') && !selectedText.endsWith('**');
					const italicStartsWithSingleUnderscore =
						selectedText.startsWith('_') && !selectedText.startsWith('__');
					const italicEndsWithSingleUnderscore =
						selectedText.endsWith('_') && !selectedText.endsWith('__');

					if (/^\*\*\*.*\*\*\*$/.test(selectedText)) {
						shouldRemove = true;
						insertion = `**${selectedText.slice(3, -3)}**`;
					} else if (/\*\*\*.*\*\*\*/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/\*\*\*(.*?)\*\*\*/g, '**$1**');
					} else if (/\*.*\*/.test(selectedText) && !/\*\*.*\*\*/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/\*(.*?)\*/g, '$1');
					} else if (/_.*_/.test(selectedText) && !/__.*__/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/_(.*?)_/g, '$1');
					} else if (italicStartsWithSingle && italicEndsWithSingle) {
						shouldRemove = true;
						insertion = selectedText.slice(1, -1);
					} else if (italicStartsWithSingleUnderscore && italicEndsWithSingleUnderscore) {
						shouldRemove = true;
						insertion = selectedText.slice(1, -1);
					}
					break;
				}
				case 'strikethrough':
					if (/^~~.*~~$/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.slice(2, -2);
					} else if (/~~.*~~/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/~~(.*?)~~/g, '$1');
					}
					break;
				case 'underline':
					if (/^\*\*__.*__.*\*\*$/.test(selectedText)) {
						shouldRemove = true;
						const innerText = selectedText.slice(4, -4);
						insertion = `**${innerText}**`;
					} else if (/__.*__/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/__(.*?)__/g, '$1');
					} else if (/^__.*__$/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.slice(2, -2);
					}
					break;
				case 'code':
					if (/^`.*`$/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.slice(1, -1);
					} else if (/`.*`/.test(selectedText)) {
						shouldRemove = true;
						insertion = selectedText.replace(/`(.*?)`/g, '$1');
					}
					break;
			}
		}

		if (!shouldRemove) {
			switch (format) {
				case 'bold':
					insertion = `**${text.slice(start, end) || 'bold text'}**`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'italic':
					insertion = `*${text.slice(start, end) || 'italic text'}*`;
					cursorOffset = start === end ? 1 : 0;
					break;
				case 'strikethrough':
					insertion = `~~${text.slice(start, end) || 'strikethrough text'}~~`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'underline':
					insertion = `__${text.slice(start, end) || 'underline text'}__`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'list':
					insertion = `\n- List item`;
					cursorOffset = 2;
					break;
				case 'ordered-list':
					insertion = `\n1. Ordered list item`;
					cursorOffset = 3;
					break;
				case 'quote':
					insertion = `\n> ${text.slice(start, end) || 'Blockquote'}`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'code':
					insertion = `\`${text.slice(start, end) || 'code'}\``;
					cursorOffset = start === end ? 1 : 0;
					break;
				case 'math':
					insertion = `$$${text.slice(start, end) || 'math equation (block)'}$$`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'image':
					insertion = `![Alt text](https://example.com/image.jpg)`;
					cursorOffset = 2;
					break;
				case 'link':
					insertion = `[Link text](https://example.com)`;
					cursorOffset = 1;
					break;
				case 'h1':
					insertion = `\n# ${text.slice(start, end) || 'Heading 1'}`;
					cursorOffset = start === end ? 2 : 0;
					break;
				case 'h2':
					insertion = `\n## ${text.slice(start, end) || 'Heading 2'}`;
					cursorOffset = start === end ? 3 : 0;
					break;
				case 'h3':
					insertion = `\n### ${text.slice(start, end) || 'Heading 3'}`;
					cursorOffset = start === end ? 4 : 0;
					break;
				default:
					if (format.startsWith('emoji-')) {
						insertion = format.slice(6);
					}
			}
		}

		const newText = shouldRemove
			? text.slice(0, start) + insertion + text.slice(end)
			: text.slice(0, start) + insertion + text.slice(end);

		const newStartPos = start;
		const newEndPos = shouldRemove ? start + insertion.length : start + insertion.length;

		this.markdown = newText;

		setTimeout(() => {
			ta.focus();
			if (start !== end || shouldRemove) {
				ta.setSelectionRange(newStartPos, newEndPos);
				const updatedSelectedText = ta.value.substring(newStartPos, newEndPos);
				this.selectedText = updatedSelectedText;
			} else {
				const cursorPos = start + insertion.length - cursorOffset;
				ta.setSelectionRange(cursorPos, cursorPos);
				this.selectedText = '';
			}
		}, 10);
	}

	// Table functions
	addTableRow() {
		this.tableRows = this.tableRows + 1;
		this.tableContent = [...this.tableContent, Array(this.tableCols).fill('')];
	}

	addTableColumn() {
		this.tableCols = this.tableCols + 1;
		this.tableContent = this.tableContent.map((row) => [...row, '']);
	}

	deleteTableRow(rowIndex: number) {
		if (this.tableRows <= 1) return;
		this.tableRows = this.tableRows - 1;
		this.tableContent = this.tableContent.filter((_, index) => index !== rowIndex);
	}

	deleteTableColumn(colIndex: number) {
		if (this.tableCols <= 1) return;
		this.tableCols = this.tableCols - 1;
		this.tableContent = this.tableContent.map((row) =>
			row.filter((_, index) => index !== colIndex)
		);
	}

	updateTableCell(rowIndex: number, colIndex: number, value: string) {
		const newContent = [...this.tableContent];
		newContent[rowIndex][colIndex] = value;
		this.tableContent = newContent;
	}

	generateMarkdownTable(): string {
		let table = '| ';
		table += this.tableContent[0].map((cell, i) => cell || `Header ${i + 1}`).join(' | ');
		table += ' |\n';
		table += '| ' + Array(this.tableCols).fill('---').join(' | ') + ' |\n';
		for (let i = 1; i < this.tableContent.length; i++) {
			table += '| ' + this.tableContent[i].join(' | ') + ' |\n';
		}
		return table;
	}

	copyMarkdownTable() {
		const table = this.generateMarkdownTable();
		navigator.clipboard.writeText(table);
	}

	insertMarkdownTable() {
		const table = this.generateMarkdownTable();
		const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;

		const newText = text.slice(0, start) + '\n' + table + '\n' + text.slice(end);
		this.markdown = newText;

		setTimeout(() => {
			textarea.focus();
			const newPos = start + table.length + 2;
			textarea.setSelectionRange(newPos, newPos);
		}, 10);
	}

	// Utility functions
	copyToClipboard() {
		navigator.clipboard.writeText(this.markdown);
		this.showCopyDialog = true;
		setTimeout(() => (this.showCopyDialog = false), 2000);
	}

	clearMarkdown() {
		this.markdown = '';
		this.showClearDialog = false;
	}

	replaceLatexDelimiters(text: string): string {
		return text.replace(/\\\[(.*?)\\\]/g, '$$$$1$$').replace(/\\\((.*?)\\\)/g, '$$$1$$');
	}
}

export function setMarkdownContext(config: MarkdownMasterConfig) {
	const context = new MarkdownMasterContext(config);
	setContext(CONTEXT_KEY, context);
	return context;
}

export function getMarkdownContext(): MarkdownMasterContext {
	const context = getContext<MarkdownMasterContext>(CONTEXT_KEY);
	if (!context) {
		throw new Error('MarkdownMasterContext not found. Did you forget to call setMarkdownContext?');
	}
	return context;
}
