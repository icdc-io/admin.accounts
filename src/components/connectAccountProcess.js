import Loader from "container/Loader";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

const ConnectProcessModal = ({ open }) => {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			// onOpenChange={(isOpen: boolean) => {
			//   setOpen(isOpen);
			// }}
		>
			<DialogContent
				aria-describedby={undefined}
				className="connectingAccounts"
			>
				<DialogHeader>
					<DialogTitle>{t("connecting")}</DialogTitle>
				</DialogHeader>
				<div className="descr-connectingAccounts">
					<Loader />
					<br />
					<span>{t("connectingMessage")}</span>
				</div>
			</DialogContent>
		</Dialog>
	);
};

ConnectProcessModal.propTypes = {
	open: PropTypes.bool,
};

export default ConnectProcessModal;
