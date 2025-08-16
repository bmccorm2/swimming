import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';

export type TagType = Doc<'Tags'>;
export type SwimWorkoutType = Doc<'SwimWorkouts'>;
export type SwimWorkoutFullType = Doc<'SwimWorkouts'> & {
	tags: TagType[];
};

export const SwimWorkoutFields = {
	author: v.string(),
	isVisible: v.boolean(),
	swimWorkoutText: v.string(),
	yards: v.float64()
};

export const selectedTags = {
	tags: v.array(v.id('Tags'))
};

export const swimWorkoutFull = {
	...SwimWorkoutFields,
	...selectedTags
};

export const swimWorkoutUpdate = {
	_id: v.id('SwimWorkouts'),
	...swimWorkoutFull
};

export default defineSchema({
	SwimWorkouts: defineTable(SwimWorkoutFields).index('by_isVisible', ['isVisible']),
	Tags: defineTable({
		tag: v.string()
	}),
	SwimWorkout_Tag_Association: defineTable({
		swimWorkoutId: v.id('SwimWorkouts'),
		tagId: v.id('Tags')
	}).index('by_swimWorkout', ['swimWorkoutId'])
});
