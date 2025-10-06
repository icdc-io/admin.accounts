export const countryOptions = [
	{ key: "am", value: "Armenia", text: "Armenia" },
	{ key: "au", value: "Australia", text: "Australia" },
	{ key: "at", value: "Austria", text: "Austria" },
	{ key: "az", value: "Azerbaijan", text: "Azerbaijan" },
	{ key: "bs", value: "Bahamas", text: "Bahamas" },
	{ key: "by", value: "Belarus", text: "Belarus" },
	{ key: "be", value: "Belgium", text: "Belgium" },
	{ key: "bg", value: "Bulgaria", text: "Bulgaria" },
	{ key: "ca", value: "Canada", text: "Canada" },
	{ key: "cn", value: "China", text: "China" },
	{ key: "cy", value: "Cyprus", text: "Cyprus" },
	{ key: "cz", value: "Czechia", text: "Czechia" },
	{ key: "ee", value: "Estonia", text: "Estonia" },
	{ key: "fi", value: "Finland", text: "Finland" },
	{ key: "fr", value: "France", text: "France" },
	{ key: "ge", value: "Georgia", text: "Georgia" },
	{ key: "de", value: "Germany", text: "Germany" },
	{ key: "in", value: "India", text: "India" },
	{ key: "il", value: "Israel", text: "Israel" },
	{ key: "it", value: "Italy", text: "Italy" },
	{ key: "jp", value: "Japan", text: "Japan" },
	{ key: "kz", value: "Kazakhstan", text: "Kazakhstan" },
	{ key: "kg", value: "Kyrgyzstan", text: "Kyrgyzstan" },
	{ key: "lv", value: "Latvia", text: "Latvia" },
	{ key: "lt", value: "Lithuania", text: "Lithuania" },
	{ key: "lu", value: "Luxembourg", text: "Luxembourg" },
	{ key: "mx", value: "Mexico", text: "Mexico" },
	{ key: "pl", value: "Poland", text: "Poland" },
	{ key: "ro", value: "Romania", text: "Romania" },
	{ key: "ru", value: "Russian Federation", text: "Russian Federation" },
	{ key: "rs", value: "Serbia", text: "Serbia" },
	{ key: "sg", value: "Singapore", text: "Singapore" },
	{ key: "es", value: "Spain", text: "Spain" },
	{ key: "sz", value: "Swaziland", text: "Swaziland" },
	{ key: "se", value: "Sweden", text: "Sweden" },
	{ key: "ch", value: "Switzerland", text: "Switzerland" },
	{ key: "tj", value: "Tajikistan", text: "Tajikistan" },
	{ key: "tr", value: "Turkey", text: "Turkey" },
	{ key: "tm", value: "Turkmenistan", text: "Turkmenistan" },
	{ key: "ua", value: "Ukraine", text: "Ukraine" },
	{ key: "ae", value: "United Arab Emirates", text: "United Arab Emirates" },
	{ key: "gb", value: "United Kingdom", text: "United Kingdom" },
	{ key: "us", value: "United States", text: "United States" },
	{ key: "uz", value: "Uzbekistan", text: "Uzbekistan" },
];

const NATURAL_PERSON_VALUE = "1";
const LEGAL_ENTITY_VALUE = "2";

export const businessTypeOptions = [
	{ text: "naturalPerson", value: NATURAL_PERSON_VALUE },
	{ text: "legalEntity", value: LEGAL_ENTITY_VALUE },
];

export const checkIfLegalEntity = (businessType) =>
	businessType === LEGAL_ENTITY_VALUE;

export const initialState = {
	/* eslint camelcase: 0 */
	name: "",
	locations: [],
	initial_price_plan_id: "",
	businessType: businessTypeOptions[0].value,
	general: {
		display_name: "",
		email: "",
		phone: "",
		contact: {
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			title: "",
		},
	},
	billing: {
		name: "",
		email: "",
		phone: "",
		address: {
			country: countryOptions[0].value,
			state: "",
			city: "",
			postal_code: "",
			street: "",
		},
		contact: {
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			title: "",
		},
		tax_exempt: "",
		tax_id_type: "",
		tax_id: "",
	},
	payment_methods: [
		{
			type: "",
			service_provider: "",
			default: true,
			bank_transfer: {
				iban: "",
				bic: "",
				bank_name: "",
				bank_address: {
					country: "",
					state: "",
					city: "",
					postal_code: "",
					street: "",
				},
			},
		},
	],
};

export const quotasBody = [
	{
		quotas: {
			compute: {
				description: "",
			},
			storage: {
				description: "",
			},
			networking: {
				description: "",
			},
			billing_engine: {
				description: "",
				// initial_price_plan_id: "",
			},
			artifactory: {
				description: "",
			},
		},
		accountName: "",
	},
];

export const taxIdOptions = [
	{ text: "eu_vat", value: "eu_vat" },
	{ text: "by_unp", value: "by_unp" },
];

export const taxIExemptOptions = [
	{ text: "noTaxExempt", value: "none" },
	{ text: "yesTaxExempt", value: "yes" },
];
