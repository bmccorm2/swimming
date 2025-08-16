<script lang="ts">
	import SwimWorkout from '$lib/SwimWorkout.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { formatToMST } from '$lib/utilities.js';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api.js';
	import { page } from '$app/state';
	import type { Id } from '../../../convex/_generated/dataModel.js';

	const workout = useQuery(api.swimWorkouts.get, {
		swimWorkoutId: page.params.id as Id<'SwimWorkouts'>
	});
</script>

<div class="mt-4">
	{#if workout.isLoading}
		<p>Loading Workout...</p>
	{:else if workout.error}
		<p>Error Loading Workout.</p>
	{:else}
		<Breadcrumb.Root class="mb-4">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					{formatToMST(workout.data._creationTime)}
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<SwimWorkout workoutDetails={workout.data} />
	{/if}
</div>
