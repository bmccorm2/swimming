import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { swimWorkoutFull, swimWorkoutUpdate } from './schema';
import { Id } from './_generated/dataModel';
import { mutationGeneric } from 'convex/server';

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
	}
});

export const insert = mutation({
	args: swimWorkoutFull,
	handler: async (ctx, args) => {
		const swimWorkoutId = await ctx.db.insert('SwimWorkouts', {
			swimWorkoutText: args.swimWorkoutText,
			yards: args.yards,
			author: args.author,
			isVisible: true
		});

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
		const workout = await ctx.db.get(args.swimWorkoutId);
		const tags = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', args.swimWorkoutId))
			.collect();
		let selectedTags: Id<'Tags'>[] = [];

		for (let i = 0; i < tags.length; i++) {
			const e = tags[i];
			const tag = await ctx.db.get(e.tagId);
			if (tag) selectedTags.push(tag?._id);
		}

		return {
			...workout,
			selectedTags
		};
	}
});

export const update = mutation({
	args: swimWorkoutUpdate,
	handler: async (ctx, args) => {
		//Update the workout
		await ctx.db.patch(args._id, {
			swimWorkoutText: args.swimWorkoutText,
			yards: args.yards,
			author: args.author,
			isVisible: true
		});

		//Delete all current tags
		const tagsToDelete = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', args._id))
			.collect();
		for (const e of tagsToDelete) {
			await ctx.db.delete(e._id);
		}

		//Recreate new tags
		for (const e of args.tags) {
			await ctx.db.insert('SwimWorkout_Tag_Association', {
				swimWorkoutId: args._id,
				tagId: e
			});
		}
		return true;
	}
});

export const permanentDelete = mutation({
	args: {
		swimWorkoutId: v.id('SwimWorkouts')
	},
	handler: async (ctx, args) => {
		//Delete all current tags
		const tagsToDelete = await ctx.db
			.query('SwimWorkout_Tag_Association')
			.withIndex('by_swimWorkout', (q) => q.eq('swimWorkoutId', args.swimWorkoutId))
			.collect();
		for (const e of tagsToDelete) {
			await ctx.db.delete(e._id);
		}

		//Delete Workout
		await ctx.db.delete(args.swimWorkoutId);
	}
});
