const API_GATEWAY = process.env.API_GATEWAY;
const BASE_URL = `${API_GATEWAY}/api`;

export const accountConnectUrl = (locationName, accountName) => `${BASE_URL}/accounts/v1/locations/${locationName}/accounts/${accountName}`;
export const accountsDataAvailableUrl = (locationName) => `${BASE_URL}/accounts/v1/locations/${locationName}/available_accounts`;
export const accountsDataUrl = (locationName) => `${BASE_URL}/accounts/v1/locations/${locationName}/accounts`;
export const setupAccountUrl = (accountName) => `/accounts/${accountName}`;
export const ACCOUNTS_REGISTRATION_URL = `${BASE_URL}/accounts/v1/registration`;

export const ACCOUNTS_AVAILABLE_FETCH = 'ACCOUNTS_AVAILABLE_FETCH';
export const ACCOUNTS_DATA_FETCH = 'ACCOUNTS_DATA_FETCH';
export const ACCOUNTS_CONNECT = 'ACCOUNTS_CONNECT';
export const ACCOUNT_DISCONNECT = 'ACCOUNT_DISCONNECT';
export const DESTROY_ACCOUNT = 'DESTROY_ACCOUNT';
export const ACCOUNTS_REGISTRATION = 'ACCOUNTS_REGISTRATION';
export const SETUP_ACCOUNT = 'SETUP_ACCOUNT';

export const notificationMessages = {
    en: {
        sucEditNotif: 'Changes saved',
        errNotif: 'An error has occurred '
    },
    ru: {
        sucEditNotif: 'Изменения сохранены',
        errNotif: 'Произошла ошибка '
    }
};
