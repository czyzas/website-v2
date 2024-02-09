function toolsFontSize() {
	/**
	 * @typedef {{
	 *     sm: string,
	 *     normal: string,
	 *     lg: string,
	 * }} FontSizeEnum
	 *
	 * @typedef {keyof FontSizeEnum} FontSizeType
	 */

	/**
	 * @enum {FontSizeType}
	 */
	const FONT_SIZE_TYPE = {
		sm: 'sm',
		normal: 'normal',
		lg: 'lg',
	};

	/**
	 *
	 * @type {Record<FontSizeType, string>}
	 */
	const FONT_SIZE_LABEL = {
		sm: fhTranslate('mala'),
		normal: fhTranslate('normalna'),
		lg: fhTranslate('duza'),
	};

	const fontSizeTrigger = /** @type {NodeListOf<HTMLButtonElement>}*/document.querySelectorAll('button[data-action="switch-font-size"]');
	const fontSize = /** @type ReactiveTuple<FontSizeType>*/ reactive(FONT_SIZE_TYPE.normal, {
		persist: {
			key: 'font-size',
		},
	});

	fontSize.subscribe((newFontSize) => {
		document.documentElement.dataset.fontSize = newFontSize;
		if (fontSizeTrigger) {
			for (const trigger of fontSizeTrigger) {
				trigger.querySelector('.font-size-name').textContent = FONT_SIZE_LABEL[newFontSize];
			}
		}
	});

	if (fontSizeTrigger) {
		for (const trigger of fontSizeTrigger) {
			trigger.addEventListener('click', () => {
				const keys = Object.keys(FONT_SIZE_TYPE);
				let nextIndex = keys.indexOf(fontSize.get()) + 1;
				if (nextIndex >= keys.length) nextIndex = 0;
				const nextItem = keys[nextIndex];
				const nextSize = FONT_SIZE_TYPE[nextItem];

				fontSize.set(nextSize);
			});
		}
	}
}
