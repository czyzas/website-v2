//Clicked outside of element
function clickedOutside(targetToClose, callback, _excludes = []) {
	const excludes = Array.isArray(_excludes) ? _excludes : [_excludes];
	const $target = $(targetToClose);

	if (typeof callback !== "function") {
		console.error('Callback has to be a function!');
		return null;
	}

	$('body').on('click', function (e) {
		const clickedElement = e.target;
		const isTargetVisible = $target.css('display') !== 'none';
		const isClickedElementExcluded = excludes.some((exclusion) => $(exclusion).is(clickedElement) || !!$(exclusion).has(clickedElement).length);
		const isClickedElementTarget = $target.is(clickedElement);
		const isClickedElementATargetChild = $target.has(clickedElement).length === 0;

		if (
			isTargetVisible &&
			!isClickedElementExcluded &&
			!isClickedElementTarget &&
			isClickedElementATargetChild
		) {
			callback($target, excludes);
		}
	});
}