import type {ComponentChild} from 'preact';
import type {ComponentType} from 'react';
import type {IntlShape} from 'react-intl';
import modules from './helpers';

// An effect is a function that does something and returns a
// function to revert what it did.
export type Effect = () => () => void;

type HelperOptions = Record<string, unknown>;
type HelperDescription = ComponentChild;

export type HelperModule<Name, Options extends HelperOptions> = {
	name: Name;
	defaultOptions: Options;
	component?: ComponentType<Options>;
	describe: (intl: IntlShape, options: Options) => HelperDescription;
	apply?: (options: Options) => Effect;
};

type HelperDef<Module> = Module extends HelperModule<infer N, infer O>
	? O & {helper: N}
	: never;

type HelperModuleOptions<Module> = Module extends HelperModule<infer N, infer O>
	? O
	: never;

export type Helper = HelperDef<(typeof modules)[keyof typeof modules]>;

type HelpersInfo = {
	[K in keyof typeof modules]: {
		mod: (typeof modules)[K];
		opts: HelperModuleOptions<(typeof modules)[K]>;
		def: HelperDef<(typeof modules)[K]>;
	};
};

type UnionToIntersection<U> = (
	U extends unknown
		? (x: U) => void
		: never
) extends (x: infer I) => void
	? I
	: never;

// Finds actual module and arguments from a helper definition.
export const helperInfo = <Name extends keyof HelpersInfo>({
	helper: name,
	...args
}: HelpersInfo[Name]['def']) => {
	const module = modules[name];

	return {
		module,
		args: {
			...module.defaultOptions,
			...args
		} as UnionToIntersection<HelpersInfo[Name]['opts']>
	};
};
