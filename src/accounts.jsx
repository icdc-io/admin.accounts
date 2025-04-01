import Loader from "container/Loader";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AccountsStore } from "./AppReducer";

const AccountsInfo = React.lazy(() => import("./components/accounts"));
const CreateAccount = React.lazy(() => import("./components/createAccount"));

const Accounts = ({ store }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		store.injectReducer("AccountsStore", AccountsStore);
		setIsLoaded(true);
	}, [store]);

	return isLoaded ? (
		<Routes>
			<Route path={"accounts"} Component={AccountsInfo} />
			<Route path={"accounts/create"} Component={CreateAccount} />
			<Route path="*" element={<Navigate to={"accounts"} replace />} />
		</Routes>
	) : (
		<Loader />
	);
};

Accounts.propTypes = {
	store: PropTypes.object,
};

export default Accounts;
