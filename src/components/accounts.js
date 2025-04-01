import { Button } from "container/Button";
import { Input } from "container/Input";
import Loader from "container/Loader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectAccounts from "./connectAccountModal";
import ConnectProcessModal from "./connectAccountProcess";
import DisconnectAccount from "./disconectAccountModal";
import "./locationAccount.scss";
import { fetchData } from "container/Api";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
	connectAccount,
	destroyInfrastructure,
	disconnectAccount,
	disconnectAccountFromOldApi,
	fetchAccountsAvailableData,
	fetchAccountsData,
	fetchAndSetFlowStatus,
	removeAccountFromStateAction,
	setupAccount,
} from "../AppActions";
import * as ActionTypes from "../AppConstants";
import { accountStatuses } from "../constants/accountStatuses";
import StatusIndicator from "../general/StatusIndicator";
import { onSearch } from "../utilities/search";
import ErrorPage, { errorTypes } from "./errorPage";

const LocationAccount = () => {
	const { t } = useTranslation();
	const [isOpenDisconnectModal, setIsOpenDisconnectModal] = useState(false);
	const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
	const [isConnectModalLoaded, setIsConnectModalLoaded] = useState(false);
	const [accountToDisconnect, setAccountToDisconnect] = useState(null);
	const [search, setSearch] = useState("");
	const [statusesFilter, setStatusesFilter] = useState("all_statuses");
	const [filteredData, setFilteredData] = useState([]);
	const dispatch = useDispatch();

	const setupApiVersion = useSelector(
		(state) => state.AccountsStore.setupApiVersion,
	);
	const accountsData = useSelector((state) => state.AccountsStore.accountsData);
	const accountsDataFetchStatus = useSelector(
		(state) => state.AccountsStore.accountsDataFetchStatus,
	);
	const missedAccounts = useSelector(
		(state) => state.AccountsStore.missedAccounts,
	);
	const currentLang = useSelector((state) => state.host.lang);
	const disconnectStatus = useSelector(
		(state) => state.AccountsStore.disconnectStatus,
	);
	const connectStatus = useSelector(
		(state) => state.AccountsStore.connectStatus,
	);
	const setupStatus = useSelector((state) => state.AccountsStore.setupStatus);

	const isNewSetupApiVersion = setupApiVersion === "new";

	const isRequestInProgress = useRef(false);

	const { location, account, role } = useSelector((state) => state.host.user);

	useEffect(() => {
		const filteredAccounts = accountsData.filter((account) => {
			return (
				statusesFilter === accountStatuses.all_statuses ||
				account.status === statusesFilter
			);
		});

		const searchedAccounts = onSearch(filteredAccounts, search);
		setFilteredData(searchedAccounts);
	}, [search, accountsData, statusesFilter]);

	const updateAvalibleGrid = () => {
		dispatch(fetchAccountsAvailableData(location));
	};

	const onConnect = (accountsToConnect, quotas) => {
		dispatch(connectAccount({ accounts: accountsToConnect, location }));
		dispatch(setupAccount(quotas));
		setIsConnectModalLoaded(false);
	};

	const onCancelConnect = () => {
		setIsOpenConnectModal(false);
	};

	const onDisconnect = () => {
		isNewSetupApiVersion
			? dispatch(
					destroyInfrastructure({
						accountId: accountToDisconnect.id,
						location,
					}),
				)
			: dispatch(
					disconnectAccountFromOldApi({
						accountId: accountToDisconnect.id,
						location,
					}),
				);
	};

	const onCancelDisconnect = () => {
		setAccountToDisconnect(null);
		setIsOpenDisconnectModal(false);
	};

	const snowConnectModal = () => {
		setIsOpenConnectModal(true);
		setIsConnectModalLoaded(true);
	};

	const showDisconnectModal = (account) => {
		setAccountToDisconnect(account);
		setIsOpenDisconnectModal(true);
	};

	useEffect(() => {
		account && dispatch(fetchAccountsData(location));
	}, [location, account, role]);

	useEffect(() => {
		let intervalId;

		const startAccountStatusCheck = () => {
			intervalId = setInterval(() => {
				if (accountsData) {
					const accountsInProgress = accountsData.filter(
						(account) =>
							account.status === accountStatuses.creating ||
							account.status === accountStatuses.deleting,
					);

					if (accountsInProgress.length > 0) {
						// biome-ignore lint/complexity/noForEach: <explanation>
						accountsInProgress.forEach((account) => {
							if (account.flow_status) {
								dispatch(
									fetchAndSetFlowStatus(account.flow_status.id, account.id),
								);
							}
						});
					} else {
						clearInterval(intervalId);
					}
				}
			}, 15000);
		};

		const handleDeletedAccounts = async () => {
			if (accountsData && !isRequestInProgress.current) {
				isRequestInProgress.current = true;

				const deletedAccounts = accountsData.filter(
					(account) => account.status === accountStatuses.deleted,
				);

				if (deletedAccounts.length > 0) {
					const response = await fetchData(
						ActionTypes.accountsDataUrl(location),
					);
					const fetchedAccounts = response || [];

					const updatedDeletedAccounts = deletedAccounts.filter(
						(deletedAccount) =>
							fetchedAccounts.some(
								(fetchedAccount) => fetchedAccount.name === deletedAccount.id,
							),
					);

					const notInFetchedAccounts = deletedAccounts.filter(
						(deletedAccount) =>
							!fetchedAccounts.some(
								(fetchedAccount) => fetchedAccount.name === deletedAccount.name,
							),
					);

					// biome-ignore lint/complexity/noForEach: <explanation>
					notInFetchedAccounts.forEach((account) => {
						dispatch(removeAccountFromStateAction(account.id));
					});

					// biome-ignore lint/complexity/noForEach: <explanation>
					updatedDeletedAccounts.forEach((account) => {
						dispatch(disconnectAccount({ accountId: account.id, location }));
					});
				}

				isRequestInProgress.current = false;
			}
		};

		if (
			accountsData?.some(
				(account) =>
					account.status === accountStatuses.creating ||
					account.status === accountStatuses.deleting,
			)
		) {
			startAccountStatusCheck();
		}

		handleDeletedAccounts();

		return () => clearInterval(intervalId);
	}, [accountsData, location, dispatch]);

	const accountStatusesOptions = Object.values(accountStatuses).map(
		(el, i) => ({ key: i, value: el, text: t(el) }),
	);

	const minContactColumnLength = filteredData.reduce(
		(acc, item) => ({
			emailLength: Math.max(acc.emailLength, item.email.length),
			nameLength: Math.max(acc.nameLength, item.name.length),
		}),
		{ emailLength: 0, nameLength: 0 },
	);

	const accountList = [...filteredData]
		.sort((a, b) => (a.idIcdc > b.idIcdc ? 1 : -1))
		.map((el) => (
			<TableRow key={el.id}>
				<TableCell className="nameColumn firstColumnCell" width={3}>
					{el.displayName || el.display_name}
				</TableCell>
				{isNewSetupApiVersion && (
					<TableCell width={3}>
						<StatusIndicator key={el.id} item={el} />
					</TableCell>
				)}
				<TableCell width={2}>
					{el.idIcdc?.toUpperCase() || el.name?.toUpperCase()}
				</TableCell>
				<TableCell>
					<div className="techContact">
						<div className="techContact-item">
							<p>{t("email")}</p>
							<p style={{ minWidth: minContactColumnLength.emailLength * 8 }}>
								{el.email}
							</p>
						</div>
						<div className="techContact-item">
							<p>{t("fullName")}</p>
							<p style={{ minWidth: minContactColumnLength.nameLength * 7 }}>
								{el.name}
							</p>
						</div>
						<div className="techContact-item">
							<p>{t("phoneNumber")}</p>
							<p>{el.phone}</p>
						</div>
					</div>
				</TableCell>
				<TableCell align="right" className="disconnect-col">
					<Button
						variant="outline"
						color="red"
						onClick={() => {
							showDisconnectModal(el);
						}}
					>
						{t("disconnect")}
					</Button>
				</TableCell>
			</TableRow>
		));

	const accountsNotFound = (
		<TableRow className="accounts-not-found">
			<TableCell colSpan="8">
				<div className="accounts-not-found-item">
					<h3>{t("accountsEmpty")}</h3>
					<br />
					<Link to={"create"}>
						<Button>{t("createAccount")}</Button>
					</Link>
				</div>
			</TableCell>
		</TableRow>
	);

	const checkStatus = () => {
		const statuses = [accountsDataFetchStatus, disconnectStatus];

		if (accountsDataFetchStatus === "403") {
			return <ErrorPage errorType={errorTypes.forbidden} />;
		}

		if (statuses.includes("rejected")) {
			return <ErrorScreen />;
		}

		if (accountsDataFetchStatus === "pending") {
			return <Loader active inline="centered" />;
		}

		return (
			<>
				<section>
					<div className="accounts-header">
						<div className="accounts-header-item">
							<h2>{t("accounts")}</h2>
							<div className="mark">{accountsData.length}</div>
						</div>
						<p
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{
								__html: t("accountsDescript", {
									location: `<b>${location}</b>`,
								}),
							}}
						/>
					</div>
					{missedAccounts.length > 0 && (
						<div className="accounts-warn">
							{t("accountsWarn")}
							{missedAccounts.map((account, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="accounts-warn-item">
									<b>{account}</b>
									<CopyButton content={account} />
									<b>{index === missedAccounts.length - 1 ? "." : ","}</b>
								</div>
							))}
							<a
								href={`https://docs.icdc.io/${currentLang}/admin/accounts/#stale-account-infrastructure`}
								target="_blank"
								rel="noreferrer"
							>
								{t("learnMore")}
							</a>
							{"."}
						</div>
					)}
					<div className="accounts-actions flex-wrap gap-2">
						<section className="flex gap-2">
							<Input
								className="small-input"
								variant="search"
								placeholder={t("searchByKeyword")}
								onChange={(event) => setSearch(event.target.value)}
								value={search}
							/>
							{isNewSetupApiVersion && (
								<Select
									value={statusesFilter}
									onValueChange={(value) => setStatusesFilter(value)}
									placeholder={t("all_statuses")}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{accountStatusesOptions.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.text}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</section>
						<section className="gap-2">
							<Link to="create">
								<Button>{t("create")}</Button>
							</Link>
							<Button onClick={snowConnectModal}>{t("connect")}</Button>
						</section>
					</div>
					{isConnectModalLoaded && (
						<SelectAccounts
							open={isOpenConnectModal}
							onCancel={onCancelConnect}
							onConnect={onConnect}
							isConnectionInProgress={connectStatus === "pending"}
							updateAvalibleGrid={updateAvalibleGrid}
						/>
					)}
					<div className="accounts-list-table-wrapper">
						{!isNewSetupApiVersion && disconnectStatus === "pending" && (
							<Loader />
						)}
						<Table className="accounts-list-table">
							<TableHeader>
								<TableRow>
									<TableHead className="firstColumnCell">{t("name")}</TableHead>
									{isNewSetupApiVersion && <TableHead>{t("status")}</TableHead>}
									<TableHead>{t("id")}</TableHead>
									<TableHead>{t("techCont")}</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredData.length > 0 ? accountList : accountsNotFound}
							</TableBody>
						</Table>
					</div>
				</section>
				{isOpenDisconnectModal && (
					<DisconnectAccount
						open={isOpenDisconnectModal}
						onCancel={onCancelDisconnect}
						onDisconnect={onDisconnect}
						accountData={accountToDisconnect}
						isDeletingInProgress={disconnectStatus === "pending"}
					/>
				)}
				<ConnectProcessModal
					open={connectStatus === "pending" || setupStatus === "pending"}
				/>
			</>
		);
	};

	return <div className="location-accounts">{checkStatus()}</div>;
};

export default LocationAccount;
