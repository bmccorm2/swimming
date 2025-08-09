<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	setupConvex(PUBLIC_CONVEX_URL);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors position="top-right" />
<ModeWatcher />
<Navbar />
<div class="md:container md:mx-auto">
	{@render children?.()}
</div>
