import type {
	Reference,
	ShallowCriterion,
	ShallowReference,
	ShallowTest,
	ShallowTheme
} from '../../common/types';

// Retrieves the reference full json object from a given
// reference version property.
export const fetchReference = (version: string) =>
	fetch(browser.runtime.getURL(`data/references/${version}.json`)).then(
		(response) => response.json()
	);

// Flattens a hierarchical reference object into a series of
// objects referencing each other : "reference", "themes",
// "criteria", and "tests".
export const flattenReference = (data: Reference) => {
	const themes: Record<ShallowTheme['id'], ShallowTheme> = {};
	const criteria: Record<ShallowCriterion['id'], ShallowCriterion> = {};
	const tests: Record<ShallowTest['id'], ShallowTest> = {};
	const reference: ShallowReference = {
		...data,
		themes: data.themes.map((theme) => {
			themes[theme.id] = {
				...theme,
				criteria: theme.criteria.map((criterion) => {
					criteria[criterion.id] = {
						...criterion,
						themeId: theme.id,
						tests: criterion.tests.map((test) => {
							tests[test.id] = {
								...test,
								criterionId: criterion.id
							};

							return test.id;
						})
					};

					return criterion.id;
				})
			};

			return theme.id;
		})
	};

	return {
		reference,
		themes,
		criteria,
		tests
	};
};
