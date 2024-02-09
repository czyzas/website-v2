function toolsSearch() {
	/**
	 * @typedef {{
	 *     Title: string,
	 *     Content: string,
	 *     Url: string,
	 *     Score?: number,
	 * }} SearchEntry
	 */
	const searchPanel = document.querySelector('.search-container .search-panel');
	const searchModal = document.querySelector('.search-results-modal');
	if (!searchPanel) return;
	if (!searchModal) return;

	const isSearchPanelOpen = /** @type {ReactiveTuple<boolean>} */reactive(false);
	const searchForm = searchPanel.querySelector('form.search-panel-wrapper');
	const searchTrigger = document.querySelector('.search-container button[data-action="search-trigger"]');
	const resultsList = searchModal.querySelector('.results-list');
	const phraseContainer = searchModal.querySelector('.phrase-container');

	isSearchPanelOpen.subscribe((newIsSearchPanelOpen) => {
		searchTrigger.ariaExpanded = newIsSearchPanelOpen;
	});

	//Search trigger
	searchPanel.addEventListener('keyup', (e) => {
		if (e.key === 'Escape') {
			isSearchPanelOpen.set(false);
		}
	});

	searchTrigger.addEventListener('click', () => {
		isSearchPanelOpen.set((currentIsOpen) => !currentIsOpen);
	});

	clickedOutside(searchPanel, () => {
		isSearchPanelOpen.set(false);
	}, [searchTrigger, searchModal]);

	/**
	 * @return {Promise<SearchEntry[]>}
	 */
	const getSearchJson = async () => {
		try {
			const response = await fetch(`${fhGetConfig('template_uri')}/search.json`);
			if (!response.ok) throw new Error('Response is not ok.');

			return await response.json();
		} catch (err) {
			console.error('error getting search.json', err.message);
			return [];
		}
	};

	const SCORE_MAP = {
		Title: 100,
		Content: 99,
	};

	searchForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(searchForm);
		const phrase = formData.get('search-term').trim();

		if (!phrase.length) return;

		// Remove all entries
		resultsList.replaceChildren();

		// Set current search phrase
		phraseContainer.textContent = phrase;

		/**
		 *	Get data
		 * @type {SearchEntry[]} data
		 */
		let data = window?.searchData;
		if (!data) {
			data = await getSearchJson();
		}

		window.searchData = data;

		// Filter results
		/** @type SearchEntry[] */
		const results = [];

		/**
		 * @param {SearchEntry} entry
		 * @return {number}
		 */
		const getScore = (entry) => {
			const match = Object.entries(SCORE_MAP).find(([property]) => {
				return entry[property].toLowerCase().trim().includes(phrase.toLowerCase());
			});

			return match?.[1] || -1;
		};

		for (const entry of data) {
			const score = getScore(entry);
			if (score > 0) {
				results.push( /** @type {SearchEntry} */{ ...entry, Score: score });
			}
		}


		// Sort scores from highest to lowest
		results.sort((a, b) => b.Score - a.Score);

		// Render results
		if (resultsList && searchModal) {
			for (const result of results) {
				resultsList.insertAdjacentHTML('beforeend', `<li><a href="${result.Url}">${result.Title}</a></li>`);
			}

			$(searchModal).fadeIn();
		} else {
			console.error('No results list');
		}

	});

	searchModal.querySelector('.close-modal').addEventListener('click', () => {
		$(searchModal).fadeOut();
	});
}
