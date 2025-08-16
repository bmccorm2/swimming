<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SwimWorkout from '$lib/SwimWorkout.svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { useQuery } from 'convex-svelte';
	import { api } from '../convex/_generated/api.js';
	import type { SwimWorkoutFullType } from '../convex/schema.js';

	const pageData = useQuery(api.swimWorkouts.getAll, {});
	const tags = useQuery(api.tags.getAll, {});

	let authorFilter = $state('');
	let tagFilter = $state('');
	let filteredWorkouts = $derived.by(() => {
		if (!pageData.data) return [];
		if (authorFilter === '' && tagFilter === '') return pageData.data.workouts;

		let authors: SwimWorkoutFullType[] = [];
		let tags: SwimWorkoutFullType[] = [];

		if (authorFilter != '')
			authors = pageData.data.workouts.filter(
				(e: SwimWorkoutFullType) => e.author === authorFilter
			);

		if (tagFilter != '')
			tags = pageData.data.workouts.filter((e1: SwimWorkoutFullType) => {
				return e1.tags?.some((e2) => e2.tag === tagFilter);
			});
		if (tagFilter === '') return authors;
		if (authorFilter === '') return tags;

		//else return common elements
		return authors.filter((e1) => tags.some((e2) => e1._id === e2._id));
	});

	$effect(() => {
		if (page.url.searchParams.get('create') === 'true')
			toast.success('Successfully created workout!!');
		if (page.url.searchParams.get('update') === 'true')
			toast.success('Successfully updated workout!!');
	});
</script>

{#snippet authorButton(authorText: string)}
	<Button
		variant="secondary"
		class={`hover:cursor-pointer ${authorFilter === authorText ? 'bg-blue-500' : ''}`}
		onclick={() =>
			authorFilter === authorText ? (authorFilter = '') : (authorFilter = authorText)}
		>{authorText}</Button
	>
{/snippet}
{#snippet tagButton(tagText: string)}
	<Button
		variant="secondary"
		class={`hover:cursor-pointer ${tagFilter === tagText ? 'bg-blue-500' : ''}`}
		onclick={() => (tagFilter === tagText ? (tagFilter = '') : (tagFilter = tagText))}
		>{tagText}</Button
	>
{/snippet}

<svelte:head>
	<title>Swimming</title>
	<meta name="swim workouts" content="save swim workouts" />
</svelte:head>

<div class="flex justify-center">
	<Button
		variant="link"
		href="/modify"
		class="me-2 mt-6 w-1/2 rounded-lg bg-gradient-to-b from-blue-700 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
		>Add a Workout</Button
	>
</div>
<hr class="my-4" />

<!-- AUTHORS -->
<div class="ml-2 md:ml-0 md:flex md:items-center">
	<div class="md:w-3/4">
		<div class="flex items-center gap-1 overflow-auto">
			<p class="mr-2 min-w-16">Authors</p>
			{#if pageData.isLoading}
				<p>Loading Authors...</p>
			{:else if pageData.error}
				<p>Error Loading Authors.</p>
			{:else}
				{#each pageData.data.authors as author}
					{@render authorButton(author)}
				{/each}
			{/if}
		</div>
		<!-- TAGS -->
		<div class="mt-2 flex items-center gap-1 overflow-auto">
			<p class="mr-2 min-w-16">Tags</p>
			{#if tags.isLoading}
				<p>Loading Tags...</p>
			{:else if tags.error}
				<p>Error Loading Tags.</p>
			{:else}
				{#each tags.data as tag}
					{@render tagButton(tag.tag)}
				{/each}
			{/if}
		</div>
	</div>
	<div
		class="mt-2 flex items-center justify-center text-4xl font-extrabold text-red-500 md:mt-0 md:justify-start"
	>
		<div class="mr-6 text-xs text-gray-500">TOTAL</div>
		<div>
			{filteredWorkouts.length}
		</div>
	</div>
</div>

<hr class="my-4" />

{#if pageData.isLoading}
	<p>Loading Workouts</p>
{:else if pageData.error}
	<p>Error Loading Workouts</p>
{:else}
	<div class="md:grid md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
		{#each filteredWorkouts as workoutDetails (workoutDetails._id)}
			<SwimWorkout {workoutDetails} />
		{/each}
	</div>
{/if}
