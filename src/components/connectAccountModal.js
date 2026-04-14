import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import { Input } from "container/Input";
import Loader from "container/Loader";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./selectAccount.scss";
import { Checkbox } from "container/Checkbox";
import { fetchAccountsAvailableData } from "../AppActions";
import { quotasBody } from "../constants/createAccountData";

export const fullCellWidth = (content) => {
	return (
		<TableRow>
			<TableCell colSpan={100}>
				<div className="empty-cell">{content}</div>
			</TableCell>
		</TableRow>
	);
};

const SelectAccounts = ({
	open,
	onConnect,
	onCancel,
	isConnectionInProgress,
}) => {
	const { t } = useTranslation();

	const [accounts, setAccounts] = useState([]);
	const [selectedAccounts, setSelectedAccounts] = useState([]);
	const [quotas, setQuotas] = useState([]);
	const dispatch = useDispatch();
	const location = useSelector((state) => state.host.user.location);

	const allAccountsFetchStatus = useSelector(
		(state) => state.AccountsStore.allAccountsFetchStatus,
	);
	const allAccounts = useSelector((state) => state.AccountsStore.allAccounts);

	useEffect(() => {
		if (!open) return;
		dispatch(fetchAccountsAvailableData(location));
	}, [location, open]);

	useEffect(() => {
		const sortSelectAccountsList = [...allAccounts].sort((a, b) =>
			a.displayName?.toLowerCase().localeCompare(b.displayName?.toLowerCase()),
		);
		setAccounts(sortSelectAccountsList);
	}, [allAccounts]);

	useEffect(() => {
		setQuotas(
			accounts
				.filter((x) => x.isChecked)
				.map((el) => quotasBody(el.id, el.displayName)),
		);
	}, [accounts]);

	const toggleCheckBox = (id) => (checked) => {
		setAccounts(
			accounts.map((a) => (a.id === id ? { ...a, isChecked: checked } : a)),
		);

		const itemIndex = selectedAccounts.findIndex((item) => item.id === id);
		if (itemIndex === -1 && checked) {
			const newItem = accounts.find((item) => item.id === id);
			if (newItem) {
				setSelectedAccounts((prev) => [
					...prev,
					{ ...newItem, isChecked: true },
				]);
			}
		} else if (itemIndex !== -1 && !checked) {
			setSelectedAccounts(selectedAccounts.filter((item) => item.id !== id));
		}
	};

	const onConnectHandler = () => {
		onConnect(
			selectedAccounts.map((x) => x.id),
			quotas,
		);
	};

	const handleSearch = useCallback(
		(e) => {
			const value = e.target.value.toLowerCase();
			if (!value) {
				setAccounts(
					allAccounts.map((acc) =>
						selectedAccounts.find((accSelected) => accSelected.id === acc.id)
							? { ...acc, isChecked: true }
							: acc,
					),
				);
			} else {
				setAccounts(
					allAccounts
						.filter(
							(x) =>
								x.displayName.toLowerCase().includes(value) ||
								x.idIcdc.toLowerCase().includes(value) ||
								x.name.toLowerCase().includes(value) ||
								x.email.toLowerCase().includes(value) ||
								x.phone.toLowerCase().includes(value),
						)
						.map((acc) =>
							acc.id ===
							selectedAccounts.find((accSelected) => accSelected.id === acc.id)
								?.id
								? { ...acc, isChecked: true }
								: acc,
						),
				);
			}
		},
		[allAccounts, selectedAccounts],
	);

	const cancelModal = () => {
		setAccounts(allAccounts);
		setSelectedAccounts([]);
		onCancel();
	};

	const selectAccountsList = accounts.map((el) => (
		<TableRow key={el.id} className="connectElements">
			<TableCell>
				<Checkbox
					checked={el.isChecked}
					onCheckedChange={toggleCheckBox(el.id)}
				/>
			</TableCell>
			<TableCell>{el.displayName}</TableCell>
			<TableCell>{el.idIcdc}</TableCell>
			<TableCell>{el.name}</TableCell>
			<TableCell>{el.email}</TableCell>
			<TableCell>{el.phone}</TableCell>
		</TableRow>
	));
	return (
		<Dialog open={open} onOpenChange={cancelModal}>
			<DialogContent
				aria-describedby={undefined}
				className="connect-account-modal"
			>
				<DialogHeader>
					<DialogTitle>{t("selectAccounts")}</DialogTitle>
				</DialogHeader>

				<p className="description">{t("connectDescription")}</p>
				<div className="input-container">
					<Input
						variant="search"
						placeholder={t("search")}
						onChange={handleSearch}
						disabled={allAccounts.length === 0}
					/>
				</div>

				<div className="table-wrapper">
					<Table>
						<TableHeader className="connectAccount">
							<TableRow>
								<TableHead />
								<TableHead>{t("name")}</TableHead>
								<TableHead>{t("id")}</TableHead>
								<TableHead>{t("techCont")}</TableHead>
								<TableHead>{t("email")}</TableHead>
								<TableHead>{t("phone")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{allAccountsFetchStatus === "pending"
								? fullCellWidth(<Loader />)
								: allAccountsFetchStatus === "rejected"
									? fullCellWidth(<ErrorScreen />)
									: accounts.length
										? selectAccountsList
										: fullCellWidth(
												<h3 className="empty-list">{t("listEmpty")}</h3>,
											)}
						</TableBody>
					</Table>
				</div>
				<DialogFooter className="items-center flex-wrap gap-y-2">
					<p className="mr-2">
						<b>{selectedAccounts.length}</b>&nbsp;
						{t("selected")}
					</p>
					<DialogClose asChild>
						<Button
							disabled={isConnectionInProgress}
							variant="secondary"
							onClick={cancelModal}
						>
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						disabled={isConnectionInProgress || selectedAccounts.length === 0}
						onClick={onConnectHandler}
					>
						{t("connectSelected")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

SelectAccounts.propTypes = {
	open: PropTypes.bool,
	onConnect: PropTypes.func,
	onCancel: PropTypes.func,
	isConnectionInProgress: PropTypes.bool,
	allAccounts: PropTypes.array,
	updateAvalibleGrid: PropTypes.func,
};

export default SelectAccounts;
