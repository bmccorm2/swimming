import { v } from 'convex/values';
import { query } from './_generated/server';

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query('Tags').collect();
	}
});

export const getTagsForWorkout = query({
	args: {
		workoutId: v.id('SwimWorkouts')
	},
	handler: async (ctx, args) => {
		return '';
	}
});
