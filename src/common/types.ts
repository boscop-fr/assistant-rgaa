import {Helper} from '../helpers/types';

export type Test = {
	id: `${number}.${number}.${number}` | `internal.${string}`;
	title: string;
};

export type ShallowTest = Test & {
	criterionId: Criterion['id'];
};

export type CriterionReferences = {
	wcag?: {
		criteria?: string;
		techniques?: string;
	};
};

export type Criterion = {
	id: `${number}.${number}`;
	title: string;
	level: 'A' | 'AA' | 'AAA';
	tests: Test[];
	specialCases?: string;
	technicalNotes?: string;
	references?: CriterionReferences;
};

export type ShallowCriterion = Omit<Criterion, 'tests'> & {
	themeId: Theme['id'];
	tests: Test['id'][];
};

export type Theme = {
	id: `${number}`;
	title: string;
	criteria: Criterion[];
};

export type ShallowTheme = Omit<Theme, 'criteria'> & {
	criteria: Criterion['id'][];
};

export type Reference = {
	name: string;
	version: string;
	themes: Theme[];
};

export type ShallowReference = Omit<Reference, 'themes'> & {
	themes: Theme['id'][];
};

export type Instructions = {
	all?: string;
	rgaa?: string;
};

export type InstructionsByTest = Record<Test['id'], Instructions>;
export type HelpersByTest = Record<Test['id'], Helper[]>;
