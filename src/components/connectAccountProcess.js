import PropTypes from "prop-types";
import React from "react";
import { Loader, Modal } from "semantic-ui-react";
import "./locationAccount.scss";
import { useTranslation } from "react-i18next";

const ConnectProcessModal = ({ open }) => {
  const { t } = useTranslation();

  return (
    <Modal size="small" open={open} className="connectingAccounts">
      <Modal.Content>
        <label className="title-connectingAccounts">{t("connecting")}</label>
        <div className="descr-connectingAccounts">
          <Loader size="medium" inline="centered" />
          <span>{t("connectingMessage")}</span>
        </div>
      </Modal.Content>
    </Modal>
  );
};

ConnectProcessModal.propTypes = {
  open: PropTypes.bool,
};

export default ConnectProcessModal;
