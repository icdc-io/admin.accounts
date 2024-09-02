import Immutable from "seamless-immutable";
/* eslint camelcase: 0 */
import * as ActionTypes from "./AppConstants";

// eslint-disable-next-line new-cap
const initialState = Immutable({
  allAccounts: [],
  allAccountsFetchStatus: "",
  accountsData: [],
  accountsDataFetchStatus: "pending",
  connectStatus: "",
  disconnectStatus: "",
  accountRegistrationStatus: "",
  setupStatus: "",
});

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

    default:
      return state;
  }
};
