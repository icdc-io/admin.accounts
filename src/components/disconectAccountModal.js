import { Button } from "container/Button";
import { Input } from "container/Input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import PropTypes from "prop-types";
import React, { useState } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import "./deleteAccount.scss";

const Disconnect = ({
	open,
	onDisconnect,
	onCancel,
	accountData,
	isDeletingInProgress,
}) => {
	const { t } = useTranslation();

	const [confirm, setConfirm] = useState("");

	const closeModal = () => {
		onCancel();
		setConfirm("");
	};

	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent
				aria-describedby={undefined}
				className="wrapper-deleteAccountForm"
			>
				<DialogHeader>
					<DialogTitle>{t("disconnectAccount")}</DialogTitle>
				</DialogHeader>
				<div className="descr-deleteForm">
					<span>{t("disconnectAccountMess1")}</span>
					<span className="nameAccount">
						{accountData?.displayName?.replace("&quot;", '"')}
					</span>
					<span>{t("disconnectAccountMess2")}</span>
				</div>
				<div className="warning">{t("disconnectAccountWarning")}</div>
				<hr />
				<DangerousHTML
					html={t("confirmModalDisconnect", {
						service: `<b>${accountData?.displayName}</b>`,
					})}
				/>
				<Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
				<DialogFooter>
					<DialogClose asChild>
						<Button
							disabled={isDeletingInProgress}
							variant="secondary"
							onClick={closeModal}
						>
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						variant="warning"
						disabled={
							isDeletingInProgress ||
							confirm !== accountData?.displayName?.replace("&quot;", '"')
						}
						onClick={() => {
							onDisconnect();
							closeModal();
						}}
					>
						{t("disconnect")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

Disconnect.propTypes = {
	open: PropTypes.bool,
	isDeletingInProgress: PropTypes.bool,
	onDisconnect: PropTypes.func,
	onCancel: PropTypes.func,
	accountData: PropTypes.object,
};

export default Disconnect;
