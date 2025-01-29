import _ from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Input, Loader, Modal, Table } from "semantic-ui-react";

const SelectAccounts = ({
	open,
	onConnect,
	onCancel,
	isConnectionInProgress,
	updateAvalibleGrid,
}) => {
	const { t } = useTranslation();

	const [accounts, setAccounts] = useState([]);
	const [selectedAccounts, setSelectedAccounts] = useState([]);

	const [quotas, setQuotas] = useState([]);

	const allAccountsFetchStatus = useSelector(
		(state) => state.AccountsStore.allAccountsFetchStatus,
	);
	const allAccounts = useSelector((state) => state.AccountsStore.allAccounts);

	useEffect(updateAvalibleGrid, []);

	useEffect(() => {
		const sortSelectAccountsList = _.sortBy(allAccounts, (o) => {
			return o.displayName;
		});
		setAccounts([...sortSelectAccountsList]);
	}, [allAccounts]);

	useEffect(() => {
		setQuotas(
			accounts
				.filter((x) => x.isChecked)
				.map((el) => ({
					accountName: el.id,
					quotas: {
						compute: { description: el.displayName },
						storage: { description: el.displayName },
						networking: { description: el.displayName },
						billing_engine: { description: el.displayName },
						artifactory: { description: el.displayName },
					},
				})),
		);
	}, [accounts]);

	const toggleCheckBox = (id) => (e) => {
		setAccounts(
			accounts.map((a) =>
				a.id === id ? { ...a, isChecked: e.target.checked } : a,
			),
		);

		const itemIndex = selectedAccounts.findIndex((item) => item.id === id);
		if (itemIndex === -1 && e.target.checked) {
			const newItem = accounts.find((item) => item.id === id);
			if (newItem) {
				setSelectedAccounts((prev) => [
					...prev,
					{ ...newItem, isChecked: true },
				]);
			}
		} else if (itemIndex !== -1 && !e.target.checked) {
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
		<Table.Row key={el.id} className="connectElements">
			<Table.Cell style={{ paddingLeft: "0" }}>
				<label>
					<input
						type="checkbox"
						value={el.isChecked}
						onClick={toggleCheckBox(el.id)}
					/>
					<span>
						<div className={el.isChecked ? "check-circle" : ""} />
					</span>
				</label>
			</Table.Cell>
			<Table.Cell>{el.displayName}</Table.Cell>
			<Table.Cell>{el.idIcdc}</Table.Cell>
			<Table.Cell>{el.name}</Table.Cell>
			<Table.Cell>{el.email}</Table.Cell>
			<Table.Cell>{el.phone}</Table.Cell>
		</Table.Row>
	));
	return (
		<Modal size="large" className="connect-account-modal" open={open}>
			<Modal.Content>
				<button type="button" className="close-btn" onClick={cancelModal} />
				<label className="title">{t("selectAccounts")}</label>
				<p className="description">{t("connectDescription")}</p>
				<Input
					className="search"
					icon="search"
					iconPosition="left"
					placeholder={t("search")}
					onChange={handleSearch}
					disabled={allAccounts.length === 0}
				/>
				<div className="table-wrapper">
					{allAccountsFetchStatus !== "fulfilled" ? (
						<Loader
							size="medium"
							active={allAccountsFetchStatus === "pending"}
							inline="centered"
						/>
					) : (
						<Table basic="very">
							<Table.Header className="connectAccount">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>{t("name")}</Table.HeaderCell>
									<Table.HeaderCell>{t("id")}</Table.HeaderCell>
									<Table.HeaderCell>{t("techCont")}</Table.HeaderCell>
									<Table.HeaderCell>{t("email")}</Table.HeaderCell>
									<Table.HeaderCell>{t("phone")}</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>{selectAccountsList}</Table.Body>
						</Table>
					)}
				</div>
				<Modal.Actions className="btn-selectModal">
					<p>
						<span>{selectedAccounts.length}</span>
						{t("selected")}
					</p>
					<Button
						disabled={isConnectionInProgress}
						content={t("cancel")}
						onClick={cancelModal}
					/>
					<Button
						disabled={isConnectionInProgress || selectedAccounts.length === 0}
						color="blue"
						content={t("connectSelected")}
						onClick={onConnectHandler}
					/>
				</Modal.Actions>
			</Modal.Content>
		</Modal>
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
