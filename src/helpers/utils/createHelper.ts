import type {HelperModule} from '../types';

export const createHelper = <const N, O>(module: HelperModule<N, O>) => module;
