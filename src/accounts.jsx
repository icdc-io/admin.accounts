import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { AccountsStore } from "./AppReducer";

const AccountsInfo = React.lazy(() => import("./components/accounts"));

const Accounts = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("AccountsStore", AccountsStore);
    setIsLoaded(true);
  }, []);

  return isLoaded ? <AccountsInfo /> : <Loader active inline="centered" />;
};

Accounts.propTypes = {
  store: PropTypes.object,
};

export default Accounts;
