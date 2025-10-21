<script lang="ts">
	import { onMount } from 'svelte';
	import { useTheme } from 'svelte-themes';
	import { Moon, Sun, Monitor } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	const theme = useTheme();
	let currentTheme = $state(theme?.theme || 'system');
	let mounted = $state(false);

	// Properly apply the dark class to document for shadcn components
	function applyTheme(value: string) {
		if (typeof document !== 'undefined') {
			if (
				value === 'dark' ||
				(value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	function setTheme(value: string) {
		if (theme) {
			theme.theme = value;
			currentTheme = value;
			applyTheme(value);
		}
	}

	// Cycle through themes: light -> dark -> system -> light
	function cycleTheme() {
		const themes = ['light', 'dark', 'system'];
		const currentIndex = themes.indexOf(currentTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		setTheme(themes[nextIndex]);
	}

	// Wait for client-side hydration to complete
	onMount(() => {
		mounted = true;

		// Apply theme on mount
		if (theme?.theme) {
			applyTheme(theme.theme);
		}

		// Listen for system preference changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme?.theme === 'system') {
				applyTheme('system');
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});

	// Initialize and update when theme changes
	$effect(() => {
		if (theme?.theme && mounted) {
			currentTheme = theme.theme;
			applyTheme(theme.theme);
		}
	});

	// Get tooltip text based on current theme
	let tooltipText = $derived(
		currentTheme === 'light'
			? 'Switch to dark theme'
			: currentTheme === 'dark'
				? 'Switch to system theme'
				: 'Switch to light theme'
	);
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				onclick={cycleTheme}
				variant="outline"
				size="sm"
				class="relative"
				aria-label="Toggle theme"
			>
				<!-- Light theme icon -->
				<Sun
					class="h-4 w-4 scale-100 rotate-0 text-orange-500 transition-all dark:scale-0 dark:-rotate-90 {currentTheme ===
					'system'
						? 'opacity-0'
						: ''}"
				/>
				<!-- Dark theme icon -->
				<Moon
					class="absolute h-4 w-4 scale-0 rotate-90 text-blue-400 transition-all dark:scale-100 dark:rotate-0 {currentTheme ===
					'system'
						? 'dark:opacity-0'
						: ''}"
				/>
				<!-- System theme icon (shown when system is active) -->
				{#if currentTheme === 'system'}
					<Monitor
						class="absolute h-4 w-4 scale-100 text-purple-500 transition-all dark:text-purple-400"
					/>
				{/if}
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{tooltipText}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
