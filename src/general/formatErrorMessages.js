const OPTION_FIELD = "value";
const ERROR_MESSAGE_SEPARATOR = "|||";

export const formatI18nMessageToString = (key, ...values) => {
	if (!values?.length) return key;

	return [key, ...values].join(ERROR_MESSAGE_SEPARATOR);
};

export const formatI18nMessageToObject = (errorMessage) => {
	if (!errorMessage) return [];
	const [key, ...options] = errorMessage.split(ERROR_MESSAGE_SEPARATOR);
	const translationOptions = options.reduce((acc, curr, index) => {
		const currentFieldName = index ? OPTION_FIELD + index : OPTION_FIELD;
		acc[currentFieldName] = curr;
		return acc;
	}, {});

	return [key, translationOptions];
};
