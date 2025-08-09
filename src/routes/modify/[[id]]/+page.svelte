<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card/index.js';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { api } from '../../../convex/_generated/api.js';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Id } from '../../../convex/_generated/dataModel.js';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	const id = page.params.id;
	const client = useConvexClient();
	const displayTags = useQuery(api.tags.getAll, {});
	let selectedTags: Id<'Tags'>[] = $state([]);
	if (id) {
		selectedTags = []; //TODO FOR UPDATE!!
	}

	let {
		workoutText = undefined,
		author = undefined,
		yards = undefined,
		tags = undefined
	}: {
		workoutText: string | undefined;
		author: string | undefined;
		yards: number | undefined;
		tags: undefined;
	} = $props();

	function handleTab(event: KeyboardEvent) {
		const el = event.target as HTMLTextAreaElement;

		if (event.key === 'Tab') {
			event.preventDefault();
			const start = el.selectionStart;
			const end = el.selectionEnd;

			// Insert the tab character at the cursor position
			el.value = el.value.substring(0, start) + '   ' + el.value.substring(end);
		}
	}

	async function handleSubmit() {
		if (workoutText !== undefined && author !== undefined && yards !== undefined) {
			if (
				await client.mutation(api.swimWorkouts.insert, {
					swimWorkoutText: workoutText,
					author,
					yards,
					isVisible: true,
					tags: selectedTags
				})
			) {
				goto('/?success=true');
			}
		}
	}

	$effect(() => {
		if (page.url.searchParams.get('success') === 'true')
			toast.success('Successfully created workout!!');
	});
</script>

<svelte:head>
	<title>{id ? 'Modify Workout' : 'Add a Workout'}</title>
	<meta name="swim workouts" content="add or change an existing swim workout" />
</svelte:head>

<Card.Root class="mt-2">
	<Card.Header>{id ? 'UPDATE WORKOUT' : 'ADD A WORKOUT'}</Card.Header>
	<Card.Content>
		<form>
			<div class="mb-4 lg:flex lg:gap-2">
				<!-- WORKOUT AREA -->
				<Textarea
					class="h-72 rounded-md p-2 ring-1 ring-slate-400"
					bind:value={workoutText}
					onkeydown={handleTab}
					placeholder="Workout"
					autocomplete="off"
					spellcheck="false"
				/>
				<div class="ml-6 lg:w-4/12">
					<!-- AUTHOR -->
					<Input
						placeholder="Author"
						class="rounded-md ring-1 ring-slate-400"
						bind:value={author}
						autocomplete="off"
					/>
					<!-- YARDS -->
					<Input
						type="number"
						placeholder="Yards"
						class="mt-4 rounded-md ring-1 ring-slate-400"
						bind:value={yards}
						autocomplete="off"
					/>
					<!-- TAGS -->
					{#if displayTags.isLoading}
						<p class="mt-8 text-center">Loading Tags...</p>
					{:else if displayTags.error}
						<p>Error Loading Tags.</p>
					{:else}
						<div class="mx-2 mt-8 grid grid-cols-2 gap-2 xl:grid-cols-3">
							{#each displayTags.data as tag}
								{@const checked = selectedTags?.some((e) => e === tag._id)}
								<div class="flex">
									<Label class="ml-2">
										<Checkbox
											{checked}
											onCheckedChange={(v) => {
												if (v) {
													selectedTags.push(tag._id);
												} else {
													selectedTags = selectedTags?.filter((e) => e != tag._id);
												}
											}}
										/>
										{tag.tag}</Label
									>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="my-8 flex justify-center">
				<Button
					type="submit"
					onclick={handleSubmit}
					class="w-1/2 bg-gradient-to-b from-blue-700 to-blue-600 font-bold text-white uppercase"
					>Submit</Button
				>
			</div>
		</form>
	</Card.Content>
</Card.Root>
