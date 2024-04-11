import {ComponentType} from 'react';
import {IntlShape} from 'react-intl';
import * as modules from './helpers';

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

export type HelperDef<Module> = Module extends HelperModule<infer N, infer O>
	? O & {helper: N}
	: never;

export type HelperModuleOptions<Module> = Module extends HelperModule<
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

export type UnionToIntersection<U> = (
	U extends any ? (x: U) => void : never
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
		args: args as UnionToIntersection<HelpersInfo[Name]['opts']>
	};
};
