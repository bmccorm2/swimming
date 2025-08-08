import type { Doc } from '../convex/_generated/dataModel';

export type TagType = Doc<'Tags'>;
export type SwimWorkoutFullType = Doc<'SwimWorkouts'> & {
	tags: TagType[];
};

export const authorValues = [
	'All',
	'Jen',
	'Bryan',
	'Bob',
	'Micha',
	'Ryan',
	'Brad',
	'Kirk'
] as const;
export type AuthorFilter = (typeof authorValues)[number];

export const tagValues = [
	'All',
	'Free',
	'IM/Stroke',
	'Sprint',
	'Distance',
	'Kick',
	'Misc'
] as const;
export type TagFilter = (typeof tagValues)[number];
