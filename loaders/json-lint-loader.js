import path from 'node:path';

// We're using the contents of JSON files as TS objects to
// leverage the compiler typechecking.
// @see https://github.com/microsoft/TypeScript/issues/32063#issuecomment-800162987
export default function (json) {
	// Although we're flagging the loader as not cacheable,
	// it is still not rerun when the JSON changes.
	// Using `cache: false` as a global option in webpack
	// config fixes the problem but it is too much of a
	// radical solution.
	// @TODO Find a way to fix recompilation.
	this.cacheable(false);

	const {typesPath, type} = this.getOptions();
	const absoluteTypesPath = this.utils.absolutify(this.rootContext, typesPath);
	const relativeTypesPath = path.parse(
		this.utils.contextify(this.context, absoluteTypesPath)
	);

	// The import path must be extensionless.
	const {dir, name} = relativeTypesPath;
	const typesImportPath = path.join(dir, name);

	// We're not breaking lines until the JSON starts so the
	// line numbers are matching between the original file
	// and the TS version, making error reporting accurate.
	// This is a simple trick to avoid building a sourcemap.
	const ts =
		`import {type ${type}} from ${JSON.stringify(typesImportPath)}; ` +
		`export default ${json.trim()} satisfies ${type};`;

	// The original file is added as a dependency so any edit
	// should trigger the build again.
	this.addDependency(this.resourcePath);
	this.addDependency(absoluteTypesPath);

	// Allows ts-loader to recognize the file as TS source.
	this.resourcePath = this.resourcePath.replace('.json', '.ts');
	return ts;
}
