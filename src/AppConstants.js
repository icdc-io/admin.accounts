const REACT_APP_API_GATEWAY = process.env.REACT_APP_API_GATEWAY;
const BASE_URL = `${REACT_APP_API_GATEWAY}/api`;

export const accountConnectUrl = (locationName, accountName) =>
	`${BASE_URL}/accounts/v1/locations/${locationName}/accounts/${accountName}`;
export const accountsDataAvailableUrl = (locationName) =>
	`${BASE_URL}/accounts/v1/locations/${locationName}/available_accounts`;
export const accountsDataUrl = (locationName) =>
	`${BASE_URL}/accounts/v1/locations/${locationName}/accounts`;
export const setupAccountUrl = (accountName) => `accounts/${accountName}`;
export const setupAccountsUrl = () => "accounts";
export const setupflowsUrl = (flow_id) => `flows/${flow_id}`;
export const ACCOUNTS_REGISTRATION_URL = `${BASE_URL}/accounts/v1/registration`;

export const ACCOUNTS_AVAILABLE_FETCH = "ACCOUNTS_AVAILABLE_FETCH";
export const ACCOUNTS_DATA_FETCH = "ACCOUNTS_DATA_FETCH";
export const ACCOUNTS_CONNECT = "ACCOUNTS_CONNECT";
export const ACCOUNT_DISCONNECT = "ACCOUNT_DISCONNECT";
export const DESTROY_ACCOUNT = "DESTROY_ACCOUNT";
export const ACCOUNTS_REGISTRATION = "ACCOUNTS_REGISTRATION";
export const SETUP_ACCOUNT = "SETUP_ACCOUNT";
export const SETUP_STATUS_RESET = "SETUP_STATUS_RESET";
export const ACCOUNTS_DATA_FROM_SETUP_FETCH = "ACCOUNTS_DATA_FROM_SETUP_FETCH";
export const FETCH_FLOW_STATUS = "FETCH_FLOW_STATUS";
export const ACCOUNTS_WITHOUT_INFRASTRUCTURE =
	"ACCOUNTS_WITHOUT_INFRASTRUCTURE";
export const ACCOUNT_REMOVE_FROM_STATE = "ACCOUNT_REMOVE_FROM_STATE";
export const SET_TO_STATE__FLOW_STATUS = "SET_TO_STATE__FLOW_STATUS";

export const SET_SETUP_API_VERSION = "SET_SETUP_API_VERSION";

export const notificationMessages = {
	en: {
		sucEditNotif: "Changes saved",
		errNotif: "An error has occurred ",
	},
	ru: {
		sucEditNotif: "Изменения сохранены",
		errNotif: "Произошла ошибка ",
	},
};
