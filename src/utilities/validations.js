const validationMessages = {
	ru: {
		required: "Обязательное поле",
		number: "Должно быть число",
		positiveNumber: "Должно быть положительное число",
		minLength: (min) => `Должно быть ${min} символов или больше`,
		email: "Почта",
		phoneNumber: 'Введите корретный номер телефона, начинающийся на "+"',
		idValidation: "Только строчные буквы, цифры, не более 5 символов",
		latinLetters: "Должны быть только латинские буквы",
		nameWithSpace: "Должны быть только латинские буквы, кириллица, цифры",
	},
	en: {
		required: "Required",
		number: "Must be a number",
		positiveNumber: "Must be a positive number",
		minLength: (min) => `Must be ${min} characters or more`,
		email: "Email",
		phoneNumber: 'Enter a valid phone number, starting with a "+"',
		idValidation:
			"Only lower case, latin letters, digits. Must be 5 characters or less",
		latinLetters: "Must be latin letters",
		nameWithSpace: "Must be latin letters, cyrillic, digits",
	},
};

export const required = (value) =>
	value
		? undefined
		: validationMessages[localStorage.getItem("icdc-lang") || "en"].required;
export const number = (value) =>
	value && Number.isNaN(Number(value))
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].number
		: undefined;
export const positiveNumber = (value) =>
	value && value < 0
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.positiveNumber
		: undefined;

export const minLength = (value) =>
	value && value.length < 3
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].minLength(3)
		: undefined;

export const email = (value) =>
	value &&
	!value.match(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].email
		: undefined;

export const phoneNumber = (value) =>
	value && !value.match(/^[+]\d{7,13}$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].phoneNumber
		: undefined;

export const idValidation = (value) =>
	value && !value.match(/^[a-z0-9]{1,5}$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].idValidation
		: undefined;

export const latinLetters = (value) =>
	value && !value.match(/^[a-zA-Z ]+$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].latinLetters
		: undefined;

export const nameWithSpace = (value) =>
	value && !value.match(/^[a-zA-Zа-яёА-ЯЁ0-9 ]+$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.nameWithSpace
		: undefined;
