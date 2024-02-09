/**
 * Handle elements highlighter logic
 */
function toolsHighlighter() {
	const subpage = document.querySelector('main.subpage');
	if (!subpage) return;
	const pageUrl = fhGetConfig('page_url');
	const reportToolsSidebar = document.querySelector('aside.report-tools');
	if (!reportToolsSidebar) return;

	const storageKey = 'highlighter-' + fhGetConfig('page_url');
	const highlighterButton = reportToolsSidebar.querySelector('button[data-action="toggle-highlighter"]');

	const isHighlighting = /** @type {ReactiveTuple<boolean>} */reactive(false);
	const highlightedElements = /** @type {ReactiveTuple<string[]>} */reactive([], {
		persist: {
			key: storageKey,
		},
	});

	isHighlighting.subscribe((newValue) => {
		highlighterButton.classList.toggle('active', newValue);
		subpage.classList.toggle('with-highlighter', newValue);
		highlighterButton.ariaPressed = newValue;
	});

	// Get highlighted elements from localStorage
	const elements = highlightedElements.get();
	for (const xpath of elements) {
		const element = lookupElementByXPath(xpath);
		if (element) {
			element.classList.add('highlighted')
		}
	}

	// Disable highlighting on Esc press
	document.addEventListener('keyup', (e) => {
		if (e.key === "Escape" && isHighlighting.get()) {
			isHighlighting.set(false)
		}
	})

	// Handle highlighter on/off
	highlighterButton.addEventListener('click', () => {
		isHighlighting.set((currentValue) => !currentValue)
	});

	// Handle highlighting click
	// This query looks for any element inside subpage, which doesn't have children or have children with elements such as `br`, `b`, `strong`, `span`, `a`, `abbr`, `i`, `em`, etc.
	// Elements such as aside.report-tools, a, buttons, svgs, etc. are excluded and can't be highlighted.
	$('.subpage').find(':not(:has(:not(br, b, strong, span, a, abbr, i, em))):not(aside.report-tools *, a, button, svg, hr, br,a *, button *, svg *, abbr, abbr *)').click(function (event) {
		if (!isHighlighting.get()) return;
		const el = event.target;
		const xpath = createXPathFromElement(event.target);
		const isHighlighted = el.classList.contains('highlighted');
		el.classList.toggle('highlighted', !isHighlighted);

		if (!isHighlighted) {
			highlightedElements.set((currentHighlighted) => currentHighlighted.concat(xpath));
		} else {
			highlightedElements.set((currentHighlighted) => currentHighlighted.filter((element) => element !== xpath));
		}
	});
}

// TODO: replace it with https://github.com/thiagodp/get-xpath
function createXPathFromElement(elm) {
	let i;
	let sib;
	let segs;
	for (segs = []; elm && elm.nodeType === 1; elm = elm.parentNode) {
		for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
			if (sib.localName === elm.localName) i++;
		}
		segs.unshift(elm.localName.toLowerCase() + `[${i}]`);
	}
	return segs.length ? '/' + segs.join('/') : null;
}

function lookupElementByXPath(path) {
	const evaluator = new XPathEvaluator();
	const result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	return result.singleNodeValue;
}
