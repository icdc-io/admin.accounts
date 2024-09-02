import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Loader, Table } from "semantic-ui-react";
import SelectAccounts from "./connectAccountModal";
import ConnectProcessModal from "./connectAccountProcess";
import DisconnectAccount from "./disconectAccountModal";
import "./locationAccount.scss";
import { useTranslation } from "react-i18next";
import {
  connectAccount,
  disconnectAccount,
  fetchAccountsAvailableData,
  fetchAccountsData,
  resetStatusAccount,
  setupAccount,
} from "../AppActions";
import CreateAccount from "./createAccount";
import ErrorPage from "./errorPage";

const LocationAccount = () => {
  const { t } = useTranslation();
  const [isOpenDisconnectModal, setIsOpenDisconnectModal] = useState(false);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [isConnectModalLoaded, setIsConnectModalLoaded] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState(null);
  const [createMode, setCreateMode] = useState(false);

  const accountsData = useSelector((state) => state.AccountsStore.accountsData);
  const accountsDataFetchStatus = useSelector(
    (state) => state.AccountsStore.accountsDataFetchStatus,
  );
  const disconnectStatus = useSelector(
    (state) => state.AccountsStore.disconnectStatus,
  );
  const connectStatus = useSelector(
    (state) => state.AccountsStore.connectStatus,
  );
  const setupStatus = useSelector((state) => state.AccountsStore.setupStatus);

  const dispatch = useDispatch();

  const { location, account } = useSelector((state) => state.host.user);

  const updateAvalibleGrid = () => {
    dispatch(fetchAccountsAvailableData(location));
  };

  const updateGrid = () => {
    account && dispatch(fetchAccountsData(location));
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
    dispatch(
      disconnectAccount({ accountId: accountToDisconnect.id, location }),
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

  useEffect(updateGrid, [location, account]);

  const accountList = [...accountsData]
    .sort((a, b) => (a.idIcdc > b.idIcdc ? 1 : -1))
    .map((el) => (
      <Table.Row key={el.id}>
        <Table.Cell className="nameColumn firstColumnCell">
          {el.displayName}
        </Table.Cell>
        <Table.Cell>{el.idIcdc?.toUpperCase()}</Table.Cell>
        <Table.Cell>{el.name}</Table.Cell>
        <Table.Cell>{el.email}</Table.Cell>
        <Table.Cell>{el.phone}</Table.Cell>
        <Table.Cell textAlign="right">
          <Button
            negative
            content={t("disconnect")}
            onClick={() => {
              showDisconnectModal(el);
            }}
          />
        </Table.Cell>
      </Table.Row>
    ));

  const checkStatus = () => {
    const statuses = [accountsDataFetchStatus, disconnectStatus];

    if (statuses.includes("rejected")) {
      return <ErrorPage />;
    }

    if (accountsDataFetchStatus === "pending") {
      return <Loader active inline="centered" />;
    }

    return createMode ? (
      <CreateAccount setCreateMode={setCreateMode} updateGrid={updateGrid} />
    ) : (
      <>
        <section>
          <div className="accounts-wrapper">
            <h2>{t("accounts")}</h2>
            <div>
              <Button
                primary
                onClick={() => {
                  setCreateMode(true);
                  dispatch(resetStatusAccount());
                }}
                content={t("create")}
              />
              <Button
                primary
                onClick={snowConnectModal}
                content={t("connect")}
              />
            </div>
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
          <div>
            {statuses.includes("pending") && (
              <Loader
                size="medium"
                className="loader"
                active
                inline="centered"
              />
            )}
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="firstColumnCell">
                    {t("name")}
                  </Table.HeaderCell>
                  <Table.HeaderCell>{t("id")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("techCont")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("email")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("phone")}</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              {accountsData.length > 0 && (
                <Table.Body>{accountList}</Table.Body>
              )}
            </Table>
          </div>
        </section>
        <DisconnectAccount
          open={isOpenDisconnectModal}
          onCancel={onCancelDisconnect}
          onDisconnect={onDisconnect}
          accountData={accountToDisconnect}
          isDeletingInProgress={disconnectStatus === "pending"}
        />
        <ConnectProcessModal
          open={connectStatus === "pending" || setupStatus === "pending"}
        />
      </>
    );
  };

  return <div className="location-accounts">{checkStatus()}</div>;
};

export default LocationAccount;
