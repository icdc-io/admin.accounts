import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import forbiddenIcon from "../assets/403.svg";
import errorIcon from "../assets/error.svg";

export const errorTypes = {
	forbidden: "403",
	unauthorized: "401",
	wrong: "500",
};

const ErrorPage = ({ errorType }) => {
	const { t } = useTranslation();
	const accountsDataFetchError = useSelector(
		(state) => state.AccountsStore.accountsDataFetchError,
	);

	const isAccountWrong = accountsDataFetchError.includes("account");
	const forbiddenMessage = isAccountWrong
		? "forbiddenAccountMessage"
		: "forbiddenRoleMessage";
	const forbiddenTitle = isAccountWrong ? "incorrectAccount" : "forbiddenTitle";

	const unauthorizedStatus =
		errorType === errorTypes.forbidden || errorType === errorTypes.unauthorized;

	return (
		<div className="error-content">
			<div className="error-tip">
				<h2>
					{t([unauthorizedStatus ? forbiddenTitle : "somethingWrongTitle"])}
				</h2>
				<p>{t([unauthorizedStatus ? forbiddenMessage : "errorDescription"])}</p>
			</div>
			<img
				src={unauthorizedStatus ? forbiddenIcon : errorIcon}
				alt="Error logo"
				width={700}
			/>
		</div>
	);
};

ErrorPage.propTypes = {
	t: PropTypes.func,
	errorType: PropTypes.string,
};

export default ErrorPage;
