import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { swimWorkoutFull, swimWorkoutUpdate, TagType } from './schema';

export const getAll = query({
	handler: async (ctx) => {
		let authors: Set<string> = new Set();

		const workouts = await ctx.db
			.query('SwimWorkouts')
			.withIndex('by_isVisible', (q) => q.eq('isVisible', true))
			.order('desc')
			.collect();
		const tags = await ctx.db.query('Tags').collect();
		const fullWorkouts = [];

		for (let i = 0; i < workouts.length; i++) {
			const e = workouts[i];

			// Get a distinct list of authors
			if (!authors.has(e.author)) authors.add(e.author);

			const swimTags = await ctx.db
				.query('SwimWorkout_Tag_Association')
				.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', e._id))
				.collect();
			const tagObjects = tags.filter((tag) => swimTags.some((st) => st.tagId === tag._id));

			fullWorkouts.push({
				...e,
				tags: tagObjects
			});
		}

		return {
			workouts: fullWorkouts,
			authors: Array.from(authors)
		};
	}
});

export const hide = mutation({
	args: {
		id: v.id('SwimWorkouts')
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			isVisible: false
		});
		return { success: true };
	}
});

export const insert = mutation({
	args: swimWorkoutFull,
	handler: async (ctx, args) => {
		const { tags, ...workoutData } = args;
		const swimWorkoutId = await ctx.db.insert('SwimWorkouts', workoutData);

		for (let i = 0; i < args.tags.length; i++) {
			const tagId = args.tags[i];
			await ctx.db.insert('SwimWorkout_Tag_Association', {
				swimWorkoutId,
				tagId
			});
		}
		return true;
	}
});

export const get = query({
	args: {
		swimWorkoutId: v.id('SwimWorkouts')
	},
	handler: async (ctx, args) => {
		const { swimWorkoutId } = args;
		const workout = await ctx.db.get(swimWorkoutId);
		if (!workout) throw new Error(`Workout with id ${swimWorkoutId} not found`);

		const workoutTags = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', swimWorkoutId))
			.collect();
		let tags: TagType[] = [];

		for (let i = 0; i < workoutTags.length; i++) {
			const e = workoutTags[i];
			const tag = await ctx.db.get(e.tagId);
			if (tag) tags.push(tag);
		}

		return {
			...workout,
			tags
		};
	}
});

export const update = mutation({
	args: swimWorkoutUpdate,
	handler: async (ctx, args) => {
		const { _id, tags, ...workoutData } = args;

		//Update the workout
		await ctx.db.patch(_id, workoutData);

		//Delete all current tags
		const tagsToDelete = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', _id))
			.collect();
		for (const e of tagsToDelete) {
			await ctx.db.delete(e._id);
		}

		//Recreate new tags
		for (const e of tags) {
			await ctx.db.insert('SwimWorkout_Tag_Association', {
				swimWorkoutId: _id,
				tagId: e
			});
		}
		return { success: true };
	}
});

export const permanentDelete = mutation({
	args: {
		swimWorkoutId: v.id('SwimWorkouts')
	},
	handler: async (ctx, args) => {
		const { swimWorkoutId } = args;

		//Delete all current tags
		const tagsToDelete = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', swimWorkoutId))
			.collect();
		for (const e of tagsToDelete) {
			await ctx.db.delete(e._id);
		}

		//Delete Workout
		await ctx.db.delete(swimWorkoutId);
	}
});
