jQuery(function ($) {
	$(document).ready(function () {
		if (typeof acf !== 'undefined') {
			acf.add_action('load', function () {
				$(document).on('click', '.numbers-converter', openNumbersConverterForm);
			});
		}
	});

	function openNumbersConverterForm(e) {
		const editorEl = $(e.target).siblings('.add_media').data('editor');
		const editorId = editorEl.split('-')[2] || 'content';

		const popup = $('<div class="numbers-converter-popup" data-editor="' + editorId + '">');
		const convertPLtoEN = $('<fieldset><input type="radio" id="cpe" name="convertNumbersType" value="PLtoEN"><label for="cpe">PL -> EN: 1 024,56 -> 1,024.56</label></fieldset>');
		const convertENtoPL = $('<fieldset><input type="radio" id="cep" name="convertNumbersType" value="ENtoPL"><label for="cep">EN -> PL: 1,024.56 -> 1 024,56</label></fieldset>');
		const convertBRACKtoMIN = $('<fieldset><input type="radio" id="cbm" name="convertNumbersType" value="BRACKtoMIN"><label for="cbm">Nawiasy na minusy: (1 024,56) -> -1 024,56 ORAZ (1,024.56) -> -1,024.56</label></fieldset>');
		const convertMINtoBRACK = $('<fieldset><input type="radio" id="cmb" name="convertNumbersType" value="MINtoBRACK"><label for="cmb">Minusy na nawiasy: -1 024,56 -> (1 024,56) ORAZ -1,024.56 -> (1,024.56)</label></fieldset>');
		const addNbspDigits = $('<fieldset><input type="radio" id="nbsp-digits" name="convertNumbersType" value="NbspDigits"><label for="nbsp-digits">Dodaj niełamiące spacje (nbsp;) między cyframi</label></fieldset>');
		const btnContainer = $("<div class='buttonsContainer'>");
		const closebtn = $('<button type="button" class="button closeBtn">Zamknij</button>');
		const convertbtn = $('<button type="button" class="button button-primary convertNumbers">Konwertuj</button>');

		convertPLtoEN.appendTo(popup);
		convertENtoPL.appendTo(popup);
		convertBRACKtoMIN.appendTo(popup);
		convertMINtoBRACK.appendTo(popup);
		addNbspDigits.appendTo(popup);
		closebtn.appendTo(btnContainer);
		convertbtn.appendTo(btnContainer);
		btnContainer.appendTo(popup);
		if (!$('.numbers-converter-popup').length) {
			popup.appendTo($('body'));
		}

		$('.closeBtn').click(function () {
			$(this).closest('.numbers-converter-popup').remove();
		});

		// const convertDateToTemp = (content) => content.replaceAll(/(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/g, '$1@@$2@@$3');
		// const convertDateToTempRevert = (content) => content.replaceAll(/(3[01]|[12][0-9]|0?[1-9])\@@(1[012]|0?[1-9])\@@((?:19|20)\d{2})/g, '$1.$2.$3');

		const convertCommasToDots = (content) => content.replaceAll(/(\d)\,+(?=\d)/g, '$1.');
		const convertSpacesToCommas = (content) => content.replaceAll(/(\d)\s+(?=\d)/g, '$1,');
		const convertCommasToSpaces = (content) => content.replaceAll(/(\d)\,+(?=\d)/g, '$1 ');
		const convertDotsToCommas = (content) => content.replaceAll(/(\d)\.+(?=\d)/g, '$1,');
		const convertBracketsToNegativeNumber = (content) => content.replaceAll(/\((\d[\d,.\s\a-zA-Z]+)\)/g, '-$1');
		const convertNegativeNumberToBrackets = (content) => content.replaceAll(/-\s?(\d.+)/g, '($1)');
		const addNonBreakingSpacesDigits = (content) => content.replaceAll(/(\d)\s+(?=\d)/g, '$1\u00A0');

		function convertCellNumber(convertText, convertType) {
			if (convertType === 'PLtoEN') {
				const convertTextArray = convertText.split(/(\s+)/).map((text) => {
					if (text.match(/\d+(?:,\d+){2,}/g)) {
						return text;
					} else {
						return convertCommasToDots(text);
					}
				}).join('');
				return convertSpacesToCommas(convertTextArray);
			} else if (convertType === 'ENtoPL') {
				const convertTextArray = convertText.split(/(\s+)/).map((text) => {
					if ( (text.match(/\d+(?:\.\d+){2,}/g)) || (text.match(/\d{2}.\d{4}/g)) ) {
					 	return text;
					} else {
						text = ' '+text;
						if (text.match(/[^\d,]\d{1,3}(?:,\d{3})+/g)) {
							text = convertCommasToSpaces(text);
						}
						text = convertDotsToCommas(text);
						return text;
					}
				}).join('');
				return convertTextArray;
			} else if (convertType === 'BRACKtoMIN') {
				return convertBracketsToNegativeNumber(convertText);
			} else if (convertType === 'MINtoBRACK') {
				return convertNegativeNumberToBrackets(convertText);
			} else if (convertType === 'NbspDigits') {
				return addNonBreakingSpacesDigits(convertText);;
			} else {
				return convertText
			}
		}

		$('.convertNumbers').click(function () {
			const convertNumbersType = $('.numbers-converter-popup input[name=convertNumbersType]:checked').val();
			if (!convertNumbersType) {
				return;
			}

			const dataEditor = $('.numbers-converter-popup').data('editor');
			const dataEditorID = dataEditor === 'content' ? dataEditor : `acf-editor-${dataEditor}`;

			const contentAfterDiv = document.createElement('div');
			contentAfterDiv.innerHTML = tinymce.get(dataEditorID).getContent();

			contentAfterDiv.querySelectorAll('th, td').forEach(function (el) {
				let cellText = el.innerHTML;
				let cellTextChanged = convertCellNumber(cellText, convertNumbersType);
				el.innerHTML = cellTextChanged;
			});

			const contentAfterConvert = contentAfterDiv.innerHTML;

			// switch (convertNumbersType) {
			// 	case 'PLtoEN':
			// 		contentAfterConvert = convertCommasToDots(contentAfterConvert);
			// 		contentAfterConvert = convertSpacesToCommas(contentAfterConvert);
			// 		break;
			// 	case 'ENtoPL':
			// 		contentAfterConvert = convertDateToTemp(contentAfterConvert);
			//
			// 		contentAfterConvert = convertCommasToSpaces(contentAfterConvert);
			// 		contentAfterConvert = convertDotsToCommas(contentAfterConvert);
			//
			// 		contentAfterConvert = convertDateToTempRevert(contentAfterConvert);
			// 		break;
			// 	case 'BRACKtoMIN':
			// 		contentAfterConvert = convertBracketsToNegativeNumber(contentAfterConvert);
			// 		break;
			// 	case 'MINtoBRACK':
			// 		contentAfterConvert = convertNegativeNumberToBrackets(contentAfterConvert);
			// 		break;
			// }
			//
			tinymce.get(dataEditorID).setContent(contentAfterConvert);

			$(this).closest('.numbers-converter-popup').remove();
		});
	}
});
