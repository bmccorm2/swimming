import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	SwimWorkouts: defineTable({
		author: v.string(),
		isVisible: v.boolean(),
		swimWorkoutText: v.string(),
		yards: v.float64()
	}).index('by_isVisible', ['isVisible']),
	Tags: defineTable({
		tag: v.string()
	}),
	SwimWorkout_Tag_Association: defineTable({
		swimWorkoutId: v.id('SwimWorkouts'),
		tagId: v.id('Tags')
	}).index('by_swimWorkout', ['swimWorkoutId'])
});
