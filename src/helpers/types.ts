import {type ComponentType} from 'react';
import {type IntlShape} from 'react-intl';
import modules from './helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HelperOptions = Record<string, any>;
type HelperDescription = ReturnType<IntlShape['formatMessage']>;

export type HelperModule<Name, Options extends HelperOptions> = {
	name: Name;
	defaultOptions: Options;
	component?: ComponentType<Options>;
	describe: (intl: IntlShape, options: Options) => HelperDescription;
	apply?: (uuid: string, options: Options) => void;
	revert?: (uuid: string, options: Options) => void;
};

export type HelperDef<Module> =
	Module extends HelperModule<infer N, infer O> ? O & {helper: N} : never;

export type HelperModuleOptions<Module> =
	Module extends HelperModule<
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		infer N,
		infer O
	>
		? O
		: never;

export type Helper = HelperDef<(typeof modules)[keyof typeof modules]>;

export type HelpersInfo = {
	[K in keyof typeof modules]: {
		mod: (typeof modules)[K];
		opts: HelperModuleOptions<(typeof modules)[K]>;
		def: HelperDef<(typeof modules)[K]>;
	};
};

export type UnionToIntersection<U> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(U extends any ? (x: U) => void : never) extends (x: infer I) => void
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
