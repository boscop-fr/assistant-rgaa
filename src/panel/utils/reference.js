export const DEFAULT_VERSION = '4-2023';

/*
 * retrieve the reference full json object from a given reference version property
 */
export const fetchReference = (version) =>
	fetch(browser.runtime.getURL(`data/references/${version}.json`)).then(
		(response) => response.json()
	);

/**
 *	Flattens a hierarchical reference object into a series of
 *	objects referencing each other : "reference", "themes",
 *	"criteria", and "tests".
 */
export const flattenReference = (data) => {
	const themes = {};
	const criteria = {};
	const tests = {};

	// HORREUR SORRY BISOUS
	const reference = {
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
