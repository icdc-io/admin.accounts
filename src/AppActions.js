import { createData, deleteData, fetchData } from "container/Api";
import { toast } from "sonner";
import * as ActionTypes from "./AppConstants";

const errorNotification = (error) => {
	const errorMessage = error.response.data?.error || error.response.data;
	toast.error(
		ActionTypes.notificationMessages[localStorage.getItem("icdc-lang") || "en"]
			.errNotif + errorMessage,
	);
};

const successNotification = () =>
	toast.success(
		ActionTypes.notificationMessages[localStorage.getItem("icdc-lang") || "en"]
			.sucEditNotif,
	);

export const infoNotification = (msg) => toast.info(msg);

const fetchAccountsAvailableDataAction = (locationName) => ({
	type: ActionTypes.ACCOUNTS_AVAILABLE_FETCH,
	payload: fetchData(ActionTypes.accountsDataAvailableUrl(locationName)),
});

export const fetchAccountsAvailableData = (locationName) => (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_PENDING` });

	const response = dispatch(fetchAccountsAvailableDataAction(locationName));
	response.then((data) => {
		const accountData = data.value.map((account) => ({
			id: account.name,
			displayName: account.display_name,
			idIcdc: account.name,
			name: `${account.contact.first_name} ${account.contact.last_name}`,
			email: account.contact.email,
			phone: account.contact.phone,
			isChecked: false,
		}));
		dispatch({
			type: `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_FULFILLED`,
			payload: accountData,
		});
	}, errorNotification);
};

const fetchAccountsDataAction = (locationName) => ({
	type: ActionTypes.ACCOUNTS_DATA_FETCH,
	payload: fetchData(ActionTypes.accountsDataUrl(locationName)),
});

export const fetchAccountsData = (locationName) => (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_PENDING` });
	const response = dispatch(fetchAccountsDataAction(locationName));

	response.then((data) => {
		const accountData = data.value.map((account) => ({
			id: account.name,
			displayName: account.display_name,
			idIcdc: account.name,
			name: `${account.contact.first_name} ${account.contact.last_name}`,
			email: account.contact.email,
			phone: account.contact.phone,
		}));
		dispatch({
			type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_FULFILLED`,
			payload: accountData.sort((a, b) =>
				a.displayName > b.displayName
					? 1
					: a.displayName < b.displayName
						? -1
						: 0,
			),
		});
	}, errorNotification);
};

const connectAccountAction = (payload, account) => ({
	type: ActionTypes.ACCOUNTS_CONNECT,
	payload: createData(
		ActionTypes.accountConnectUrl(payload.location, account),
		payload,
	),
});

export const connectAccount = (payload) => {
	return (dispatch) => {
		dispatch({ type: `${ActionTypes.ACCOUNTS_CONNECT}_PENDING` });

		const requests = payload.accounts.map(async (account) =>
			dispatch(connectAccountAction(payload, account)),
		);

		Promise.all(requests).then(() => {
			dispatch(fetchAccountsData(payload.location));
			dispatch(fetchAccountsAvailableData(payload.location));
		}, errorNotification);
	};
};

const disconnectAccountAction = (payload) => ({
	type: ActionTypes.ACCOUNT_DISCONNECT,
	payload: deleteData(
		ActionTypes.accountConnectUrl(payload.location, payload.accountId),
	),
});

const destroyInfrastructureAction = (payload) => ({
	type: ActionTypes.DESTROY_ACCOUNT,
	payload: deleteData(
		`/api/setup/v1/${ActionTypes.setupAccountUrl(payload.accountId)}`,
	),
});

export const disconnectAccount = (payload) => (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNT_DISCONNECT}_PENDING` });

	const response = dispatch(destroyInfrastructureAction(payload));

	response.then(() => {
		dispatch(disconnectAccountAction(payload)).then(() => {
			dispatch(fetchAccountsData(payload.location));
			dispatch(fetchAccountsAvailableData(payload.location));
			successNotification();
		}, errorNotification);
	}, errorNotification);
};

export const resetStatusAccount = () => ({
	type: `${ActionTypes.ACCOUNTS_REGISTRATION}_RESET`,
});

const setupAccountAction = (setupBody) => ({
	type: ActionTypes.SETUP_ACCOUNT,
	payload: createData(
		`/api/setup/v1/${ActionTypes.setupAccountUrl(setupBody.accountName)}`,
		setupBody.quotas,
	),
});

export const setupAccount = (payload) => (dispatch) => {
	dispatch({ type: `${ActionTypes.SETUP_ACCOUNT}_PENDING` });
	const requests = payload.map((setupBody) =>
		dispatch(setupAccountAction(setupBody)),
	);
	Promise.all(requests).then(() => {
		successNotification();
	}, errorNotification);
};

const createAccountAction = (payload) => ({
	type: ActionTypes.ACCOUNTS_REGISTRATION,
	payload: createData(
		`/api/accounts/v1/${ActionTypes.ACCOUNTS_REGISTRATION_URL}`,
		payload,
	),
});

export const createAccount = (payload) => (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNTS_REGISTRATION}_PENDING` });

	const response = dispatch(createAccountAction(payload));
	response.then(() => successNotification(), errorNotification);
};
