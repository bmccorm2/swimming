import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { swimWorkoutFull } from './schema';

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
