import Loader from "container/Loader";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { AccountsStore } from "./AppReducer";

const AccountsInfo = React.lazy(() => import("./components/accounts"));

const Accounts = ({ store }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		store.injectReducer("AccountsStore", AccountsStore);
		setIsLoaded(true);
	}, [store]);

	return isLoaded ? <AccountsInfo /> : <Loader />;
};

Accounts.propTypes = {
	store: PropTypes.object,
};

export default Accounts;
