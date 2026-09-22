export class HighlightOptions {
	public readonly element: HTMLElement;
	public readonly targetElement: HTMLElement;

	#tag = false;
	#ifEmpty = false;
	#ifHidden: boolean | undefined = undefined;
	#attributes = new Set<string>();
	#missingAttributes = new Set<string>();
	#content = false;
	#outline = false;

	constructor(element: HTMLElement, targetElement = element) {
		this.element = element;
		this.targetElement = targetElement;
	}

	get tag() {
		return this.#tag;
	}

	get ifEmpty() {
		return this.#ifEmpty;
	}

	get ifHidden() {
		return this.#ifHidden !== false;
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

	// By default, highlights would show even on hidden
	// elements. Helpers can alter this behavior only once
	// (showing primes over hiding).
	showIfHidden(show: boolean) {
		if (this.#ifHidden === undefined) {
			this.#ifHidden = show;
		} else {
			this.#ifHidden ||= show;
		}
	}

	showContent(show: boolean) {
		this.#content ||= show;
	}

	showOutline(outline: boolean) {
		this.#outline ||= outline;
	}

	pushAttributes(attributes: string[], showMissing = false) {
		for (const attribute of attributes) {
			this.#attributes.add(attribute);

			if (showMissing) {
				this.#missingAttributes.add(attribute);
			}
		}
	}
}
