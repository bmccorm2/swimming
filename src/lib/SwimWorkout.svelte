<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { PencilLine, Trash2, Link } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { formatToMST } from '$lib/utilities';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '../convex/_generated/api';
	import type { SwimWorkoutFullType } from '../convex/schema';

	const client = useConvexClient();

	let {
		workoutDetails
	}: {
		workoutDetails: SwimWorkoutFullType;
	} = $props();

	let { swimWorkoutText, yards, _creationTime, author, tags, _id } = workoutDetails;

	const copyLink = async (link: string) => {
		await navigator.clipboard.writeText(link);
		toast.info(`Workout link copied!`);
	};

	async function hideWorkout() {
		const res = await client.mutation(api.swimWorkouts.hide, { id: _id });
		if (res.success === true) toast.success('Deleted Workout');
	}
</script>

<Card.Root class="mb-2 md:mb-0">
	<Card.Content class="p-4">
		<div class={`flex justify-between ${author ? 'mb-2' : 'mb-4'}`}>
			<div class="flex content-center gap-3">
				<!-- DATE -->
				<div class="text-3xl font-bold underline">
					<a href={`/display/${_id}`}>
						{formatToMST(_creationTime)}
					</a>
				</div>
			</div>
			<!-- ACTIONS -->
			<div class="flex items-center gap-3">
				<button
					class="cursor-pointer"
					aria-label="copy url"
					onclick={() => copyLink(`${page.url.origin}/display/${_id}`)}
				>
					<Link class="h-4 w-4" />
				</button>
				<button aria-label="modify">
					<a href="modify/{_id}">
						<PencilLine class="h-4 w-4" />
					</a>
				</button>
				<button class="cursor-pointer text-red-500" aria-label="delete" onclick={hideWorkout}>
					<Trash2 class="h-4 w-4" />
				</button>
			</div>
		</div>
		<!-- AUTHOR -->
		{#if author}
			<div><p class="mb-4 text-xs text-gray-500">By: {author}</p></div>
		{/if}
		<!-- TAGS/YARDS -->
		<div class="lg:flex lg:justify-between">
			<div class="flex gap-2">
				<div class="self-center text-xs text-gray-500">Tags</div>
				{#if tags && tags.length > 0}
					{#each tags as tag}
						<Badge class="bg-purple-700 text-sm dark:text-gray-200">{tag?.tag}</Badge>
					{/each}
				{:else}
					<Badge class="bg-red-700 text-sm">No Tags</Badge>
				{/if}
			</div>

			<Badge class="mt-2 bg-blue-700 text-sm lg:mt-0 dark:text-gray-200">{yards} yards</Badge>
		</div>
		<hr class="my-4" />
		<!-- WORKOUT -->
		<div class="mb-3">
			<pre class="overflow-auto text-xs">{swimWorkoutText}</pre>
		</div>
	</Card.Content>
</Card.Root>
