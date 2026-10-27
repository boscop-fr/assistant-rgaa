// Helpers are split between the page, which applies their
// effects, and the panel, which describes them and shows
// their widgets. Both share the options defined here.

// An effect is a function that does something and returns a
// function to revert what it did.
export type Effect = () => () => void;

export type ColorContrastStyle = {
	backgroundColor: string;
	color: string;
	fontSize: string;
	fontWeight: string;
};

export type ColorInputConfig = {
	label: string;
	pixelPicker: boolean;
	textPicker: boolean;
};

export type ColorExtractorConfig = {
	label: string;
	left: keyof ColorContrastStyle;
	right: keyof ColorContrastStyle;
};

type ColorContrastOptions = {
	minimumRatio: number;
	left: ColorInputConfig;
	right: ColorInputConfig;
	extractor?: ColorExtractorConfig;
};

type ExternalToolOptions = {
	name: string;
	url: string;
};

type HeadingsHierarchyOptions = {
	// Whether or not to report missing heading levels.
	showMissing?: boolean;
};

type OutlineOptions = {
	selector: string;
	showTag?: boolean;
};

type ShowAttributesOptions = {
	selector: string;
	attributes: string[];
	// Whether or not to show attributes that aren't set.
	showMissing?: boolean;
};

type ShowChildElementsOptions = {
	selector: string;
	childrenSelector: string;
	// Children attributes to show.
	attributes?: string[];
	// Show the tag even if it is empty (i.e. it has neither
	// content nor attributes.
	showEmpty?: boolean;
	showName?: boolean;
	// Show requested attributes that are not set on the element.
	showMissingAttributes?: boolean;
	showContent?: boolean;
};

type ShowElementOptions = {
	selector: string;
	attributes?: string[];
	// Show the tag even if it is empty (i.e. it has
	// neither content nor attributes.
	showEmpty?: boolean;
	showName?: boolean;
	// Show requested attributes that are not set on the
	// element.
	showMissingAttributes?: boolean;
	showContent?: boolean;
};

export type StyleOptions = {
	style: string;
	description?: string;
};

type NoOptions = Record<never, never>;

type OptionsByHelper = {
	colorContrast: ColorContrastOptions;
	disableAllStyles: NoOptions;
	externalTool: ExternalToolOptions;
	headingsHierarchy: HeadingsHierarchyOptions;
	outline: OutlineOptions;
	showAttributes: ShowAttributesOptions;
	showChildElements: ShowChildElementsOptions;
	showElement: ShowElementOptions;
	style: StyleOptions;
	validateLocalPage: NoOptions;
	viewSource: NoOptions;
};

export type HelperName = keyof OptionsByHelper;
export type HelperOptions<N extends HelperName> = OptionsByHelper[N];
export type HelperOf<N extends HelperName> = HelperOptions<N> & {helper: N};

// A helper as found in the helpers mapping.
export type Helper = {[N in HelperName]: HelperOf<N>}[HelperName];

const defaultOptions: {[N in HelperName]: Partial<HelperOptions<N>>} = {
	colorContrast: {
		left: {
			label: 'ColorContrast.textColor',
			pixelPicker: true,
			textPicker: true
		},
		right: {
			label: 'ColorContrast.backgroundColor',
			pixelPicker: true,
			textPicker: false
		},
		extractor: {
			label: 'ColorContrast.extract',
			left: 'color',
			right: 'backgroundColor'
		}
	},
	disableAllStyles: {},
	externalTool: {},
	headingsHierarchy: {
		showMissing: true
	},
	outline: {
		showTag: false
	},
	showAttributes: {
		attributes: [],
		showMissing: false
	},
	showChildElements: {
		attributes: [],
		showEmpty: false,
		showName: true,
		showMissingAttributes: false,
		showContent: false
	},
	showElement: {
		attributes: [],
		showEmpty: false,
		showName: true,
		showMissingAttributes: false,
		showContent: false
	},
	style: {},
	validateLocalPage: {},
	viewSource: {}
};

// Returns the options of a helper, completed with defaults.
// TypeScript can't relate the rest of a generic object to
// its options, hence the cast.
export const helperOptions = <N extends HelperName>({
	helper: name,
	...options
}: HelperOf<N>) =>
	({
		...defaultOptions[name],
		...options
	}) as unknown as HelperOptions<N>;
