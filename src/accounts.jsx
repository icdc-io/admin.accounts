import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { AccountsStore } from "./AppReducer";
import PropTypes from "prop-types";
import "./App.scss";
import { Loader } from "semantic-ui-react";

const AccountsInfo = React.lazy(() => import("./components/accounts"));

const Accounts = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("AccountsStore", AccountsStore);
    setIsLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      {isLoaded ? <AccountsInfo /> : <Loader active inline="centered" />}
    </Provider>
  );
};

Accounts.propTypes = {
  store: PropTypes.object,
};

export default Accounts;
