export class HighlightOptions {
	#tag = false;
	#ifEmpty = false;
	#attributes = new Set<string>();
	#missingAttributes = new Set<string>();
	#content = false;
	#outline = false;

	constructor(
		public readonly element: HTMLElement,
		public readonly targetElement = element
	) {}

	get tag() {
		return this.#tag;
	}

	get ifEmpty() {
		return this.#ifEmpty;
	}

	get attributes() {
		return Array.from(this.#attributes);
	}

	get missingAttributes() {
		return Array.from(this.#missingAttributes);
	}

	get content() {
		return this.#content;
	}

	get outline() {
		return this.#outline;
	}

	showTag(show: boolean) {
		this.#tag ||= show;
	}

	showIfEmpty(show: boolean) {
		this.#ifEmpty ||= show;
	}

	showContent(show: boolean) {
		this.#content ||= show;
	}

	showOutline(outline: boolean) {
		this.#outline ||= outline;
	}

	pushAttributes(attributes: string[], showMissing = false) {
		attributes.forEach((attribute) => {
			this.#attributes.add(attribute);

			if (showMissing) {
				this.#missingAttributes.add(attribute);
			}
		});
	}
}
