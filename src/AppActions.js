import * as ActionTypes from './AppConstants';
import { fetchData, createData, deleteData } from 'container/Api';
import cogoToast from 'cogo-toast';

const notificationOptions = { position: 'top-right' };

const errorNotification = (error) => {
    cogoToast.error(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].errNotif + error, notificationOptions);
};

const successNotification = () =>
    cogoToast.success(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].sucEditNotif, notificationOptions);

export const infoNotification = (msg) =>
    cogoToast.info(msg, notificationOptions);

const fetchAccountsAvailableDataAction = (locationName) => ({
    type: ActionTypes.ACCOUNTS_AVAILABLE_FETCH,
    payload: fetchData(ActionTypes.accountsDataAvailableUrl(locationName), 'accounts')
});

export const fetchAccountsAvailableData = (locationName) => (dispatch) => {
    dispatch({ type: `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_PENDING` });

    const response = dispatch(fetchAccountsAvailableDataAction(locationName));
    response.then((data) => {
        const accountData = data.value.map(account => ({
            id: account.name,
            displayName: account.display_name,
            idIcdc: account.name,
            name: `${account.contact.first_name} ${account.contact.last_name}`,
            email: account.contact.email,
            phone: account.contact.phone,
            isChecked: false
        }));
        dispatch({
            type: `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_FULFILLED`,
            payload: accountData
        });
    }, error => errorNotification(error.response?.statusText));
};

const fetchAccountsDataAction = (locationName) => ({
    type: ActionTypes.ACCOUNTS_DATA_FETCH,
    payload: fetchData(ActionTypes.accountsDataUrl(locationName), 'accounts')
});

export const fetchAccountsData = (locationName) => (dispatch) => {
    dispatch({ type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_PENDING` });
    const response = dispatch(fetchAccountsDataAction(locationName));

    response.then((data) => {
        const accountData = data.value.map(account => ({
            id: account.name,
            displayName: account.display_name,
            idIcdc: account.name,
            name: `${account.contact.first_name} ${account.contact.last_name}`,
            email: account.contact.email,
            phone: account.contact.phone
        }));
        dispatch({
            type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_FULFILLED`,
            payload: accountData.sort((a, b) => a.displayName > b.displayName ? 1 : a.displayName < b.displayName ? -1 : 0)
        });;
    }, error => errorNotification(error.response?.statusText));
};

const connectAccountAction = (payload, account) => ({
    type: ActionTypes.ACCOUNTS_CONNECT,
    payload: createData(ActionTypes.accountConnectUrl(payload.location, account), payload, 'accounts')
});

export const connectAccount = (payload) => {

    return (dispatch) => {
        dispatch({ type: `${ActionTypes.ACCOUNTS_CONNECT}_PENDING` });

        const requests = payload.accounts.map(async (account) =>
            dispatch(connectAccountAction(payload, account)));

        Promise.all(requests)
            .then(() => {
                dispatch(fetchAccountsData(payload.location));
                dispatch(fetchAccountsAvailableData(payload.location));
            }, error => errorNotification(error.response?.statusText));
    };
};

const disconnectAccountAction = (payload) => ({
    type: ActionTypes.ACCOUNT_DISCONNECT,
    payload: deleteData(ActionTypes.accountConnectUrl(payload.location, payload.accountId), 'accounts')
});

const destroyInfrastructureAction = (payload) => ({
    type: ActionTypes.DESTROY_ACCOUNT,
    payload: deleteData(ActionTypes.setupAccountUrl(payload.accountId), 'setup')
});

export const disconnectAccount = (payload) => (dispatch) => {
    dispatch({ type: `${ActionTypes.ACCOUNT_DISCONNECT}_PENDING` });

    const response = dispatch(destroyInfrastructureAction(payload));

    response.then(() => {
        dispatch(disconnectAccountAction(payload))
            .then(() => {
                dispatch(fetchAccountsData(payload.location));
                dispatch(fetchAccountsAvailableData(payload.location));
                successNotification();
            }, error => errorNotification(error.response?.statusText));
    }, error => errorNotification(error.response?.statusText));
};

export const resetStatusAccount = () => ({
    type: `${ActionTypes.ACCOUNTS_REGISTRATION}_RESET`
});

const setupAccountAction = (setupBody) => ({
    type: ActionTypes.SETUP_ACCOUNT,
    payload: createData(ActionTypes.setupAccountUrl(setupBody.accountName), setupBody.quotas, 'setup')
});

export const setupAccount = (payload) => (dispatch) => {
    dispatch({ type: `${ActionTypes.SETUP_ACCOUNT}_PENDING` });
    const requests = payload.map((setupBody) => dispatch(setupAccountAction(setupBody)));
    Promise.all(requests)
        .then(() => {
            successNotification();
        }, error => {
            errorNotification(error.response?.statusText);
        });
};

const createAccountAction = (payload) => ({
    type: ActionTypes.ACCOUNTS_REGISTRATION,
    payload: createData(ActionTypes.ACCOUNTS_REGISTRATION_URL, payload, 'accounts')
});

export const createAccount = (payload) => (dispatch) => {
    dispatch({ type: `${ActionTypes.ACCOUNTS_REGISTRATION}_PENDING` });

    const response = dispatch(createAccountAction(payload));
    response.then(() => successNotification(), error => errorNotification(error.response?.statusText));
};
