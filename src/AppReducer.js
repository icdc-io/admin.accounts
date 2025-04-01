import Immutable from "seamless-immutable";
/* eslint camelcase: 0 */
import * as ActionTypes from "./AppConstants";

// eslint-disable-next-line new-cap
const initialState = Immutable({
	allAccounts: [],
	allAccountsFetchStatus: "",
	accountsData: [],
	accountsDataFetchStatus: "pending",
	accountsDataFetchError: "",
	connectStatus: "",
	disconnectStatus: "",
	accountRegistrationStatus: "",
	setupStatus: "",
	setupApiVersion: "",
	missedAccounts: [],
});

// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export const AccountsStore = (state = initialState, action) => {
	switch (action.type) {
		case `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_PENDING`:
			return state.set("allAccountsFetchStatus", "pending");
		case `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_FULFILLED`:
			return Immutable.merge(state, {
				allAccounts: action.payload,
				allAccountsFetchStatus: "fulfilled",
			});
		case `${ActionTypes.ACCOUNTS_AVAILABLE_FETCH}_REJECTED`:
			return state.set("allAccountsFetchStatus", "rejected");

		case `${ActionTypes.ACCOUNTS_DATA_FETCH}_PENDING`:
			return state.set("accountsDataFetchStatus", "pending");
		case `${ActionTypes.ACCOUNTS_DATA_FETCH}_FULFILLED`:
			return Immutable.merge(state, {
				accountsData: action.payload,
				accountsDataFetchStatus: "fulfilled",
			});
		case `${ActionTypes.ACCOUNTS_DATA_FETCH}_REJECTED`:
			return state.set("accountsDataFetchStatus", "rejected");
		case `${ActionTypes.ACCOUNTS_DATA_FETCH}_REJECTED_403`:
			return Immutable.merge(state, {
				accountsDataFetchStatus: "403",
				accountsDataFetchError: action.payload,
			});

		case `${ActionTypes.ACCOUNTS_CONNECT}_PENDING`:
			return state.set("connectStatus", "pending");
		case `${ActionTypes.ACCOUNTS_CONNECT}_FULFILLED`:
			return state.set("connectStatus", "fulfilled");
		case `${ActionTypes.ACCOUNTS_CONNECT}_REJECTED`:
			return state.set("connectStatus", "rejected");

		case `${ActionTypes.ACCOUNT_DISCONNECT}_PENDING`:
			return state.set("disconnectStatus", "pending");
		case `${ActionTypes.ACCOUNT_DISCONNECT}_FULFILLED`:
			return state.set("disconnectStatus", "fulfilled");
		case `${ActionTypes.ACCOUNT_DISCONNECT}_REJECTED`:
			return state.set("disconnectStatus", "rejected");

		case `${ActionTypes.ACCOUNTS_REGISTRATION}_PENDING`:
			return state.set("accountRegistrationStatus", "pending");
		case `${ActionTypes.ACCOUNTS_REGISTRATION}_FULFILLED`:
			return Immutable.merge(state, {
				accountRegistrationStatus: "fulfilled",
			});
		case `${ActionTypes.ACCOUNTS_REGISTRATION}_REJECTED`:
			return state.set("accountRegistrationStatus", "rejected");
		case `${ActionTypes.ACCOUNTS_REGISTRATION}_RESET`:
			return Immutable.merge(state, {
				accountRegistrationStatus: "",
			});

		case `${ActionTypes.SETUP_ACCOUNT}_PENDING`:
			return state.set("setupStatus", "pending");
		case `${ActionTypes.SETUP_ACCOUNT}_FULFILLED`:
			return state.set("setupStatus", "fulfilled");
		case `${ActionTypes.SETUP_ACCOUNT}_REJECTED`:
			return state.set("setupStatus", "rejected");

		case ActionTypes.SETUP_STATUS_RESET:
			return state.set("setupStatus", "");

		case ActionTypes.SET_SETUP_API_VERSION:
			return state.set("setupApiVersion", action.version);

		case ActionTypes.SET_TO_STATE__FLOW_STATUS:
			return Immutable.merge(state, {
				accountsData: state.accountsData.map((account) =>
					account.id === action.account
						? {
								...account,
								flow_status: action.flow_status,
								status: action.flow_status.status,
							}
						: account,
				),
			});

		case ActionTypes.ACCOUNTS_WITHOUT_INFRASTRUCTURE:
			return Immutable.merge(state, {
				missedAccounts: action.payload,
			});

		case ActionTypes.ACCOUNT_REMOVE_FROM_STATE:
			return Immutable.merge(state, {
				accountsData: state.accountsData.filter(
					(account) => account.id !== action.account,
				),
			});

		default:
			return state;
	}
};
