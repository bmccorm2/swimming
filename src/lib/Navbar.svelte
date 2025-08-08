<script lang="ts">
	import { Button } from './components/ui/button';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import { toggleMode } from 'mode-watcher';
</script>

<nav class="sticky top-0 space-x-4 bg-gray-300 px-4 py-3 lg:space-x-6 dark:bg-slate-800">
	<ul class="flex items-center justify-between">
		<li>
			<a href="/">
				<TerminalIcon />
			</a>
		</li>
		<li class="pl-6">
			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</li>
	</ul>
</nav>
