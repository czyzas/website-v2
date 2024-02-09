function toolsContrast() {
	const contrastTrigger = /** @type NodeListOf<HTMLButtonElement> */document.querySelectorAll('button[data-action="toggle-contrast"]');
	const isContrast = /** @type ReactiveTuple<boolean>*/ reactive(false, { persist: { key: 'contrast' } });

	isContrast.subscribe((newIsContrast) => {
		document.body.classList.toggle('contrast', newIsContrast);

		if (contrastTrigger) {
			for (const trigger of contrastTrigger) {
				trigger.ariaPressed = newIsContrast;
			}
		}
	});

	if (contrastTrigger) {
		for (const trigger of contrastTrigger) {
			trigger.addEventListener('click', () => {
				isContrast.set((currentIsContrast) => !currentIsContrast);
			});
		}
	}
}
