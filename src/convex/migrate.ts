import { mutation } from './_generated/server';
import type { Doc } from './_generated/dataModel';

// export const association = mutation({
// 	handler: async (ctx) => {
// 		const workoutsArr = await ctx.db.query('SwimWorkouts').collect();
// 		const tagsArr = await ctx.db.query('Tags').collect();
// 		const associations = await ctx.db.query('tempAssoc').collect();

// 		let workouts: Map<number, Doc<'SwimWorkouts'>> = new Map();
// 		let tags: Map<number, Doc<'Tags'>> = new Map();

// 		for (let i = 0; i < workoutsArr.length; i++) {
// 			const element = workoutsArr[i];
// 			const workoutId = element.id;
// 			if (workoutId) {
// 				workouts.set(workoutId, element);
// 			}
// 		}
// 		for (let i = 0; i < tagsArr.length; i++) {
// 			const element = tagsArr[i];
// 			const tagId = element.id;
// 			if (tagId) {
// 				tags.set(tagId, element);
// 			}
// 		}

// 		for (let i = 0; i < associations.length; i++) {
// 			const element = associations[i];
// 			const tagId = element.swimTagId;
// 			const workoutId = element.swimWorkoutId;
// 			const cTagId = tags.get(tagId)?._id;
// 			const cWorkoutId = workouts.get(workoutId)?._id;
// 			if (cTagId && cWorkoutId) {
// 				await ctx.db.insert('SwimWorkout_Tag_Association', {
// 					swimWorkoutId: cWorkoutId,
// 					tagId: cTagId
// 				});
// 			}
// 		}
// 	}
// });

// export const deleteUneededColumns = mutation({
// 	handler: async (ctx) => {
// 		const swimWorkouts = await ctx.db.query('SwimWorkouts').collect();
// 		const tags = await ctx.db.query('Tags').collect();

// 		for (let i = 0; i < swimWorkouts.length; i++) {
// 			const element = swimWorkouts[i];
// 			await ctx.db.patch(element._id, {
// 				id: undefined
// 			});
// 		}
// 		for (let i = 0; i < tags.length; i++) {
// 			const element = tags[i];
// 			await ctx.db.patch(element._id, {
// 				id: undefined
// 			});
// 		}
// 	}
// });
