import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Divider, Input, Modal } from "semantic-ui-react";
import "./deleteAccount.scss";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";

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
    <Modal
      size="small"
      open={open}
      className="wrapper-deleteForm"
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="close-btn" onClick={closeModal} />
        <label className="title-deleteForm">{t("disconnectAccount")}</label>
        <div className="descr-deleteForm">
          <span>{t("disconnectAccountMess1")}</span>
          <span className="nameAccount">
            {accountData?.displayName?.replace("&quot;", '"')}
          </span>
          <span>{t("disconnectAccountMess2")}</span>
        </div>
        <div className="warning">{t("disconnectAccountWarning")}</div>
      </Modal.Content>
      <Divider />
      <Modal.Content style={{ paddingTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          {
            <DangerousHTML
              html={t("confirmModalDisconnect", {
                service: `<b>${accountData?.displayName}</b>`,
              })}
            />
          }
        </div>
        <Input
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          style={{ width: "50%" }}
        />
      </Modal.Content>
      <Modal.Actions align="right">
        <Button
          disabled={isDeletingInProgress}
          content={t("cancel")}
          onClick={closeModal}
        />
        <Button
          negative
          disabled={
            isDeletingInProgress ||
            confirm !== accountData?.displayName?.replace("&quot;", '"')
          }
          content={t("disconnect")}
          onClick={() => {
            onDisconnect();
            closeModal();
          }}
        />
      </Modal.Actions>
    </Modal>
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
