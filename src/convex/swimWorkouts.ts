import { query } from './_generated/server';

export const getAll = query({
	handler: async (ctx) => {
		const workouts = await ctx.db
			.query('SwimWorkouts')
			.withIndex('by_isVisible', (q) => q.eq('isVisible', true))
			.order('desc')
			.collect();
		const tags = await ctx.db.query('Tags').collect();
		const fullWorkouts = [];

		for (let i = 0; i < workouts.length; i++) {
			const e = workouts[i];
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

		return fullWorkouts;
	}
});
