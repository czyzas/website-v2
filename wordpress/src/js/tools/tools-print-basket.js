function toolsPrintBasket() {
	const subpage = document.querySelector('main.subpage');
	if (!subpage) return;
	const pageUrl = fhGetConfig('page_url');
	const reportToolsSidebar = document.querySelector('aside.report-tools');

	const STORAGE_KEY = 'printbasket';
	const DELETE_ACTION = 'remove-print-basket-entry';
	const printVersion = /** @type {ReactiveTuple<boolean>} */reactive(false);
	printVersion.subscribe((newValue) => {
		document.body.classList.toggle('print-version', newValue);
		window.dispatchEvent(new Event('resize'));
	});

	const prints = /** @type {ReactiveTuple<ReportEntry[]>} */reactive([], { persist: { key: STORAGE_KEY } });

	// Handle showing list of prints
	const list = subpage.querySelector('.print-list');
	prints.subscribe((newPrints) => {
		if (list) {
			toolsRenderEntries({
				container: list,
				data: newPrints,
				deleteText: fhTranslate('usun'),
				emptyText: fhTranslate('koszyk_jest_pusty'),
				deleteAriaLabelText: fhTranslate('usun_z_koszyka_wydrukow'),
				deleteAction: DELETE_ACTION,
			});

			if (newPrints.length > 0) {
				const buttonWrapper = Object.assign(document.createElement('div'), { className: 'buttons' });
				const sendToPrinterButton = Object.assign(document.createElement('button'), {
					type: 'button',
					className: 'button button-brand',
					textContent: fhTranslate('wyslij_do_drukarki'),
				});
				sendToPrinterButton.dataset.action = 'send-to-printer';
				sendToPrinterButton.addEventListener('click', sendPrintsToPrinter);

				buttonWrapper.append(sendToPrinterButton);
				list.append(buttonWrapper);
			}
		}
	});

	if (list) {
		// Handle delete entry
		list.addEventListener('click', (event) => {
			if (event.target.dataset?.action !== DELETE_ACTION) return;
			const button = event.target;
			const printId = button.dataset.id;
			deletePrintBasketEntry(printId);
		});
	}

	/**
	 * Add new page to print basket
	 * @param {string} title
	 * @param {string} content
	 */
	function addToPrintBasket(title, content) {
		const printId = generateUUID();
		if (!title.trim() || !content.trim()) {
			throw new Error('Title and note text cannot be empty.');
		}

		prints.set((previousNotes) => previousNotes.concat({
			id: printId,
			url: pageUrl,
			title,
			content,
		}));
	}

	/**
	 * Update existing page in print basket
	 * @param {string} printId
	 * @param {string} title
	 * @param {string} content
	 */
	function updatePrintBasket(printId, title, content) {
		prints.set((previousNotes) => previousNotes.map((note) => {
			if (note.id === printId) {
				note.title = title;
				note.content = content;
			}

			return note;
		}));
	}

	/**
	 * Remove element from print basket
	 * @param {string} printId
	 */
	function deletePrintBasketEntry(printId) {
		const filtered = prints.get().filter((print) => print.id !== printId);
		prints.set(filtered);
	}

	function sendPrintsToPrinter() {
		// Clone HTML
		const clonedHTML = document.querySelector('html').cloneNode(true);

		// Add base href to head
		const headElement = clonedHTML.querySelector('head');
		const baseElement = Object.assign(document.createElement('base'), { href: `${location.origin}/` });
		headElement.insertBefore(baseElement, headElement.firstChild);

		// Add print-version class to body
		const bodyElement = clonedHTML.querySelector('body');
		bodyElement.classList.add('print-version');

		// get only main element from body and empty it
		const mainElement = bodyElement.querySelector('.subpage').cloneNode(true);
		mainElement.replaceChildren();

		// insert all new content into main
		mainElement.innerHTML = prints.get().map((entry) => entry.content).join('');

		// Empty body element and append main
		bodyElement.replaceChildren();
		bodyElement.append(mainElement);

		// Insert cloned HTML to new window
		const newPrintWindow = window.open();
		newPrintWindow.document.querySelector('html').innerHTML = clonedHTML.innerHTML;
	}

	if (reportToolsSidebar) {
		reportToolsSidebar.querySelector('button[data-action="add-to-print-basket"]').addEventListener('click', (event) => {
			const button = event.currentTarget;
			if (button.dataset.active === 'true') return;

			printVersion.set(true);
			button.dataset.active = 'true';
			const title = (subpage.querySelector('h1')?.textContent ?? '').trim() || fhGetConfig('page_id');
			const content = subpage.innerHTML;
			const existsAlready = prints.get().find((print) => print.url === pageUrl);
			if (existsAlready) {
				updatePrintBasket(existsAlready.id, title, content);
			} else {
				addToPrintBasket(title, content);
			}
			printVersion.set(false);
			setTimeout(() => {
				button.dataset.active = 'false';
			}, 2000);
		});

		reportToolsSidebar.querySelector('button[data-action="use-print-version"]').addEventListener('click', () => {
			printVersion.set(true);

			const hidePrintVersionButton = document.createElement('button');
			hidePrintVersionButton.dataset.action = 'hide-print-version';
			hidePrintVersionButton.className = 'button button-brand';
			hidePrintVersionButton.textContent = fhTranslate('zamknij_wersje_do_druku');
			hidePrintVersionButton.addEventListener('click', () => {
				printVersion.set(false);
				hidePrintVersionButton.remove();
			});

			document.body.prepend(hidePrintVersionButton);
		});
	}
}
