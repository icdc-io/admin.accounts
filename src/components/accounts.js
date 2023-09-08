import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectAccounts from './connectAccountModal';
import DisconnectAccount from './disconectAccountModal';
import ConnectProcessModal from './connectAccountProcess';
import { Table, Loader, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import './locationAccount.scss';
import { connectAccount, disconnectAccount, fetchAccountsAvailableData, fetchAccountsData, resetStatusAccount, setupAccount } from '../AppActions';
import CreateAccount from './createAccount';
import { withRouter } from 'react-router-dom';
import ErrorPage from './errorPage';

const LocationAccount = ({ t, history }) => {
    const [isOpenDisconnectModal, setIsOpenDisconnectModal] = useState(false);
    const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
    const [isConnectModalLoaded, setIsConnectModalLoaded] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState(null);
    const [createMode, setCreateMode] = useState(false);

    const accountsData = useSelector(state => state.AccountsStore.accountsData);
    const accountsDataFetchStatus = useSelector(state => state.AccountsStore.accountsDataFetchStatus);
    const disconnectStatus = useSelector(state => state.AccountsStore.disconnectStatus);
    const connectStatus = useSelector(state => state.AccountsStore.connectStatus);
    const setupStatus = useSelector(state => state.AccountsStore.setupStatus);

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/general');

    const { location, account } = useSelector(state => state.host.user);

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

    const onCancelConnect = () => { setIsOpenConnectModal(false); };

    const onDisconnect = () => {
        dispatch(disconnectAccount({ accountId: accountToDisconnect.id, location }));
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

    const accountList = [...accountsData].sort((a,b) => a.idIcdc > b.idIcdc ? 1 : -1).map((el) => (
        <Table.Row key={el.id}>
            <Table.Cell className='nameColumn firstColumnCell'>{el.displayName}</Table.Cell>
            <Table.Cell>{el.idIcdc?.toUpperCase()}</Table.Cell>
            <Table.Cell>{el.name}</Table.Cell>
            <Table.Cell>{el.email}</Table.Cell>
            <Table.Cell>{el.phone}</Table.Cell>
            <Table.Cell textAlign='right'>
                <Button negative
                    content={t('disconnect')}
                    onClick={() => { showDisconnectModal(el); }} />
            </Table.Cell>
        </Table.Row>
    ));

    const checkStatus = () => {
        const statuses = [accountsDataFetchStatus, disconnectStatus];

        if (statuses.includes('rejected')) {
            return <ErrorPage t={t} />
        }

        if (accountsDataFetchStatus === 'pending') {
            return <Loader active inline='centered' />;
        }

        return createMode ? <CreateAccount t={t} setCreateMode={setCreateMode} updateGrid={updateGrid}/> : <>
            <section>
                <div className='accounts-wrapper'>
                    <h2>{t('accounts')}</h2>
                    <div>
                        <Button primary
                            onClick={() => {setCreateMode(true); dispatch(resetStatusAccount());}}
                            content={t('create')}
                        />
                        <Button primary
                            onClick={snowConnectModal}
                            content={t('connect')}
                        /></div>
                </div>

                {isConnectModalLoaded && <SelectAccounts t={t} open={isOpenConnectModal}
                    onCancel={onCancelConnect}
                    onConnect={onConnect}
                    isConnectionInProgress={connectStatus === 'pending'}
                    updateAvalibleGrid={updateAvalibleGrid} />}
                <div>
               {statuses.includes('pending') && <Loader size='medium' className='loader' active inline='centered' />}
                    <Table basic='very'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell className='firstColumnCell'>{t('name')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('techCont')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('email')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('phone')}</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {accountsData.length > 0 &&
                            <Table.Body>
                                {accountList}
                            </Table.Body>
                        }
                    </Table>
                </div>
            </section>
            <DisconnectAccount
                t={t}
                open={isOpenDisconnectModal}
                onCancel={onCancelDisconnect}
                onDisconnect={onDisconnect}
                accountData={accountToDisconnect}
                isDeletingInProgress={disconnectStatus === 'pending'} />
            <ConnectProcessModal
                t={t}
                open={connectStatus === 'pending' || setupStatus === 'pending'}
            />
        </>
    };

    return <div className='location-accounts'>
        {checkStatus()}
    </div>;
};

LocationAccount.propTypes = {
    t: PropTypes.func
};

export default withRouter(LocationAccount);
