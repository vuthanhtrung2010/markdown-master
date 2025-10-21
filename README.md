# Markdown Master

A powerful, customizable Markdown editor and renderer built with Svelte 5. Featuring a split-pane live preview interface, formatting toolbar, theme switching, and local storage persistence.

## Features

- **Real-time Preview**: Edit markdown and see the rendered output side-by-side
- **Rich Formatting Toolbar**: Quick buttons for common markdown formatting
- **Theme Support**: Toggle between light, dark, and system themes
- **Local Storage**: Save your work locally and resume later
- **Responsive Design**: Works on desktop and mobile with different layouts
- **Math Support**: Render LaTeX equations with KaTeX
- **Table Generator**: Easy markdown table creation
- **Syntax Highlighting**: Code blocks with syntax highlighting
- **Keyboard Shortcuts**: Power user shortcuts for common actions

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime & package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vuthanhtrung2010/markdown-master.git
   cd markdown-master
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Build for production:
   ```bash
   bun run build
   ```

4. Preview the production build:
   ```bash
   bun run preview
   ```

## Project Structure

```
md-master/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── markdown-master/     # Core markdown editor components
│   │   │   ├── theme/               # Theme components
│   │   │   └── ui/                  # UI components (Shadcn Svelte)
│   │   ├── markdown-processor.ts    # Markdown processing utilities
│   │   └── remarkHeadingSeparator.ts  # Self-implemented remark plugin
│   └── routes/                      # SvelteKit routes
├── static/                          # Static assets
├── components.json                  # Shadcn Svelte component definitions
├── svelte.config.js                 # Svelte configuration
├── vite.config.ts                   # Vite configuration
└── package.json                     # Dependencies and scripts
```

## Usage

### Basic Usage

1. Open the app in your browser
2. Start typing in the editor on the left
3. See the rendered markdown on the right
4. Use the formatting toolbar for common markdown elements
5. Click "Save" to store your content in local storage

### Keyboard Shortcuts

- `Ctrl+B` / `Cmd+B`: Bold text
- `Ctrl+I` / `Cmd+I`: Italic text
- `Ctrl+S` / `Cmd+S`: Save document to local storage
- `Tab`: Insert 4 spaces

## Customization

The editor can be integrated into any Svelte 5 application:

```svelte
<script>
  import MarkdownMaster from '$lib/components/markdown-master/MarkdownMaster.svelte';
  
  const config = {
    title: 'My Document',
    initialContent: '# Hello World',
    placeholder: 'Start writing...'
  };
</script>

<MarkdownMaster {config} />
```

## Technologies

- [Svelte 5](https://svelte.dev/) - Component framework with runes
- [SvelteKit](https://kit.svelte.dev/) - Application framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - UI icons
- [Rehype/Remark](https://github.com/rehypejs/rehype) - Markdown processing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
