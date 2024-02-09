/**
 * Report entry - note or print basket element
 * @typedef {{
 *     id: string,
 *     url: string,
 *     title: string,
 *     content: string,
 * }} ReportEntry
 */

/**
 * Report entry - note or print basket element
 * @typedef {{
 *     container: HTMLElement,
 *     data: ReportEntry[],
 *     emptyText: string,
 *     deleteText: string,
 *     deleteAriaLabelText: string,
 *     deleteAction: 'remove-note-entry' | 'remove-print-basket-entry',
 * }} RenderEntriesOptions
 */

/**
 * Render list of notes or print basket entries, to keep consistency across both layouts
 * @param {RenderEntriesOptions} options
 */
function toolsRenderEntries(options) {
	const {
		container,
		data,
		emptyText,
		deleteText = fhTranslate('usun'),
		deleteAriaLabelText,
		deleteAction,
	} = options;

	if (!container) return;

	container.innerHTML = '';

	const isEmpty = data.length === 0;
	if (isEmpty) {
		const emptyElement = document.createElement('div');
		emptyElement.classList.add('empty');
		emptyElement.innerText = emptyText;
		container.append(emptyElement);
		return;
	}

	const resultsElement = document.createElement('div');
	resultsElement.classList.add('results');

	container.append(resultsElement);

	for (const entry of data) {
		const entryElement = document.createElement('div');
		entryElement.classList.add('entry');

		const titleElement = `
				<div class="title">
					<a href="${entry.url}">${entry.title}</a>
				</div>
			`;
		entryElement.insertAdjacentHTML('beforeend', titleElement);

		const deleteButton = `
				<div class="controls">
					<button
						type="button"
						data-id="${entry.id}"
						data-action="${deleteAction}"
						aria-label="${deleteAriaLabelText}"
						class="button button-delete"
					>${deleteText}</button>
				</div>
			`;
		entryElement.insertAdjacentHTML('beforeend', deleteButton);

		const contentsElement = document.createElement('div');
		contentsElement.classList.add('contents');
		contentsElement.innerText = entry.content;
		entryElement.append(contentsElement);

		resultsElement.append(entryElement);
	}

	container.append(resultsElement);
}
