import {
	createData,
	deleteData,
	fetchData,
	showErrorNotification,
	showSuccessNotification,
} from "container/Api";
import * as ActionTypes from "./AppConstants";
import { accountStatuses } from "./constants/accountStatuses";

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
	}, showErrorNotification);
};

const fetchAccountsDataFromSetupAction = () => ({
	type: ActionTypes.ACCOUNTS_DATA_FROM_SETUP_FETCH,
	payload: fetchData(`/api/setup/v1/${ActionTypes.setupAccountsUrl()}`),
});

const setAccountsDataWithoutSetupAction = (accounts) => ({
	type: ActionTypes.ACCOUNTS_WITHOUT_INFRASTRUCTURE,
	payload: accounts,
});

const setVersionSetupAPi = (version) => ({
	type: ActionTypes.SET_SETUP_API_VERSION,
	version,
});

export const fetchAccountsData = (locationName) => async (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_PENDING` });

	try {
		const [accountsResponse, setupResponse] = await Promise.allSettled([
			fetchData(ActionTypes.accountsDataUrl(locationName)),
			dispatch(fetchAccountsDataFromSetupAction()),
		]);

		if (accountsResponse.status === "rejected") {
			if (accountsResponse.reason?.name === "403") {
				throw accountsResponse.reason;
			}
			throw accountsResponse.reason;
		}

		if (setupResponse.status === "rejected") {
			if (setupResponse.reason?.name === "404") {
				// todo for old setup api
				dispatch(setVersionSetupAPi("old"));
				const accountData = accountsResponse.value.map((account) => ({
					id: account.name,
					displayName: account.display_name,
					idIcdc: account.name,
					name: `${account.contact.first_name} ${account.contact.last_name}`,
					email: account.contact.email,
					phone: account.contact.phone,
					status: null,
					flow_status: null,
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
			} else {
				throw setupResponse.reason;
			}
		} else {
			//! for new setup api
			dispatch(setVersionSetupAPi("new"));
			const accountData = accountsResponse.value.map((account) => {
				const accountFromSetup = setupResponse.value.value.find(
					(account2) => account2.name === account.name,
				);

				return {
					id: account.name,
					displayName: account.display_name,
					idIcdc: account.name,
					name: `${account.contact.first_name} ${account.contact.last_name}`,
					email: account.contact.email,
					phone: account.contact.phone,
					status: accountFromSetup ? accountFromSetup.status : "notConnected",
					flow_status: accountFromSetup ? accountFromSetup.flow_status : null,
				};
			});

			const missingAccounts = setupResponse.value.value
				.filter(
					(setupAccount) =>
						!accountData.some((account) => account.id === setupAccount.name),
				)
				.filter((el) => el.status !== accountStatuses.deleted)
				.map((el) => el.name);

			dispatch(setAccountsDataWithoutSetupAction(missingAccounts));

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
		}
	} catch (error) {
		if (error.name === "403") {
			dispatch({
				type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_REJECTED_403`,
				payload: error.message,
			});
			return;
		}
		dispatch({ type: `${ActionTypes.ACCOUNTS_DATA_FETCH}_REJECTED` });
		return;
	}
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
		}, showErrorNotification);
	};
};

const fetchFlowStatusAction = (flow_id) => ({
	type: ActionTypes.FETCH_FLOW_STATUS,
	payload: fetchData(`/api/setup/v1/${ActionTypes.setupflowsUrl(flow_id)}`),
});

const setToStateFlowStatusAction = (flow_status, account) => ({
	type: ActionTypes.SET_TO_STATE__FLOW_STATUS,
	flow_status,
	account,
});

export const fetchAndSetFlowStatus = (flow_id, account) => async (dispatch) => {
	try {
		const flowStatusResponse = await dispatch(fetchFlowStatusAction(flow_id));
		dispatch(setToStateFlowStatusAction(flowStatusResponse.value, account));
	} catch (error) {
		console.log(error);
	}
};

const disconnectAccountAction = (payload) => ({
	type: ActionTypes.ACCOUNT_DISCONNECT,
	payload: deleteData(
		ActionTypes.accountConnectUrl(payload.location, payload.accountId),
	),
});

export const removeAccountFromStateAction = (account) => ({
	type: ActionTypes.ACCOUNT_REMOVE_FROM_STATE,
	account,
});

const destroyInfrastructureAction = (payload) => ({
	type: ActionTypes.DESTROY_ACCOUNT,
	payload: deleteData(
		`/api/setup/v1/${ActionTypes.setupAccountUrl(payload.accountId)}`,
	),
});

export const destroyInfrastructure = (payload) => async (dispatch) => {
	try {
		const destroyInfrastructure = await dispatch(
			destroyInfrastructureAction(payload),
		);
		await dispatch(
			fetchAndSetFlowStatus(
				destroyInfrastructure.value.flow_id,
				destroyInfrastructure.value.account,
			),
		);
	} catch (error) {
		showErrorNotification(error.response?.statusText);
	}
};

export const disconnectAccount = (payload) => async (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNT_DISCONNECT}_PENDING` });
	try {
		await dispatch(disconnectAccountAction(payload));
		await dispatch(removeAccountFromStateAction(payload.accountId));
	} catch (error) {
		showErrorNotification(error);
	}
};

export const disconnectAccountFromOldApi = (payload) => async (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNT_DISCONNECT}_PENDING` });

	try {
		await dispatch(destroyInfrastructureAction(payload));
		await dispatch(disconnectAccountAction(payload));
		dispatch(fetchAccountsData(payload.location));
		dispatch(fetchAccountsAvailableData(payload.location));
		showSuccessNotification();
	} catch (error) {
		showErrorNotification(error);
	}
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

export const resetSetupStatus = () => ({
	type: ActionTypes.SETUP_STATUS_RESET,
});

export const setupAccount = (payload) => (dispatch) => {
	dispatch({ type: `${ActionTypes.SETUP_ACCOUNT}_PENDING` });
	const requests = payload.map((setupBody) =>
		dispatch(setupAccountAction(setupBody)),
	);
	Promise.all(requests).then(() => {
		showSuccessNotification();
	}, showErrorNotification);
};

const createAccountAction = (payload) => ({
	type: ActionTypes.ACCOUNTS_REGISTRATION,
	payload: createData(ActionTypes.ACCOUNTS_REGISTRATION_URL, payload, {
		"x-icdc-location": "%LOCATION",
	}),
});

export const createAccount = (payload) => (dispatch) => {
	dispatch({ type: `${ActionTypes.ACCOUNTS_REGISTRATION}_PENDING` });

	const response = dispatch(createAccountAction(payload));
	response.then(() => showSuccessNotification(), showErrorNotification);
};
