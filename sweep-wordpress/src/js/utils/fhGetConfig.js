function fhGetConfig(key) {
	const data = window?.['fh_config']?.[key];

	if (!data) {
		console.error(`Key fh_config.${key} not found.`);
	}

	return data;
}


function fhTranslate(key) {
	const translation = fhGetConfig('translations')?.[key];
	if (!translation) {
		console.error(`Translation '${key}' not found.`);
		return key;
	}
	return translation;
}
