import Loader from "container/Loader";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";

const ConnectProcessModal = ({ open }) => {
  const { t } = useTranslation();

  return (
    <Modal size="small" open={open} className="connectingAccounts">
      <Modal.Content>
        <label className="title-connectingAccounts">{t("connecting")}</label>
        <div className="descr-connectingAccounts">
          <Loader />
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
