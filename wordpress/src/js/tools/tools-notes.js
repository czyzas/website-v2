/**
 * Handle rendering notes, showing/hiding notes tool
 */
function toolsNotes() {
	const subpage = document.querySelector('main.subpage');
	if (!subpage) return;
	const pageUrl = fhGetConfig('page_url');
	const reportToolsSidebar = document.querySelector('aside.report-tools');

	const STORAGE_KEY = 'notes';
	const DELETE_ACTION = 'remove-note-entry';
	const notes = /** @type {ReactiveTuple<ReportEntry[]>} */reactive([], { persist: { key: STORAGE_KEY } });

	// Handle showing list of notes
	const list = subpage.querySelector('.notes-list');

	notes.subscribe((newNotes) => {
		if (list) {
			toolsRenderEntries({
				container: list,
				data: newNotes,
				deleteText: fhTranslate('usun'),
				emptyText: fhTranslate('brak_notatek'),
				deleteAriaLabelText: fhTranslate('usun_notatke'),
				deleteAction: DELETE_ACTION,
			});
		}
	});

	if (list) {
		list.addEventListener('click', (event) => {
			if (event.target.dataset?.action !== DELETE_ACTION) return;

			const button = event.target;
			const noteId = button.dataset.id;
			deleteNoteEntry(noteId);
		});
	}

	const notesTool = subpage.querySelector('.notes-tool');
	if (notesTool) {
		// Update textarea if there is note already saved in local storage
		const textarea = notesTool.querySelector('textarea');
		const getThisPageNote = () => notes.get().find((note) => note.url === pageUrl);
		const currentNoteContent = getThisPageNote()?.content || '';
		if (currentNoteContent && textarea) {
			textarea.value = currentNoteContent;
		}

		// Handle save note click
		notesTool.querySelector('button[data-action="save-note"]').addEventListener('click', () => {
			const text = textarea?.value?.trim() ?? '';
			if (!text) {
				showNoteAlert(fhTranslate('notatka_nie_moze_byc_pusta'));
				return;
			}

			const thisPageNote = getThisPageNote();
			if (thisPageNote) {
				updateNoteEntry(thisPageNote.id, text);
			} else {
				const title = (subpage.querySelector('h1')?.textContent ?? '').trim() || fhGetConfig('page_id');
				addNoteEntry(title, text);
			}

			showNoteAlert(fhTranslate('notatka_zostala_zapisana'));
		});

		// Handle delete note click
		notesTool.querySelector('button[data-action="delete-note"]').addEventListener('click', () => {
			const thisPageNote = getThisPageNote();
			if (thisPageNote) {
				deleteNoteEntry(thisPageNote.id);
			}

			textarea.value = '';
		});

		// Handle close note box click
		notesTool.querySelector('button[data-action="close-notes-tool"]').addEventListener('click', () => {
			notesTool.hidden = true;
		});

		// Handle show note box click
		if (reportToolsSidebar) {
			reportToolsSidebar.querySelector('button[data-action="show-notes-tool"]').addEventListener('click', () => {
				notesTool.hidden = false;
				notesTool.scrollIntoView({ behavior: 'smooth' });
				textarea.focus({ preventScroll: true });
			});
		}
	}

	// Create reusable alert element
	const noteAlert = Object.assign(document.createElement('p'), {
		className: 'note-alert', role: 'alert',
	});

	/**
	 * Reset note alert and remove it from DOM
	 */
	function hideNoteAlert() {
		noteAlert.remove();
		noteAlert.innerHTML = '';
		noteAlert.style.display = '';
	}

	/**
	 * Show alert text when something changed
	 * @param {string} text
	 * @param {number?} autohideDelay
	 */
	function showNoteAlert(text, autohideDelay = 5000) {
		if (notesTool.contains(noteAlert)) {
			hideNoteAlert();
		}

		noteAlert.innerHTML = text;

		notesTool.append(noteAlert);
		if (autohideDelay >= 0) {
			setTimeout(() => {
				$(noteAlert).slideUp(() => {
					hideNoteAlert();
				});
			}, autohideDelay);
		}
	}

	/**
	 * Add new entry to list and persist it in local storage
	 * @param {string} title
	 * @param {string} text
	 */
	function addNoteEntry(title, text) {
		const noteId = generateUUID();
		if (!title.trim() || !text.trim()) {
			throw new Error('Title and note text cannot be empty.');
		}

		notes.set((previousNotes) => previousNotes.concat({
			id: noteId,
			url: pageUrl,
			title,
			content: text,
		}));
	}

	/**
	 * Update existing note in local storage
	 * @param {string} noteId
	 * @param {string} text
	 */
	function updateNoteEntry(noteId, text) {
		notes.set((previousNotes) => previousNotes.map((note) => {
			if (note.id === noteId) {
				note.content = text;
			}

			return note;
		}));
	}

	/**
	 * Remove note from local storage
	 * @param {string} noteId
	 */
	function deleteNoteEntry(noteId) {
		notes.set((previousNotes) => previousNotes.filter((note) => note.id !== noteId));
	}
}
