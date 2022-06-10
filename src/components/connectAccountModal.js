/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input, Table, Loader } from 'semantic-ui-react';
import './selectAccount.scss';
import _ from 'lodash';
import { useSelector } from 'react-redux';

const SelectAccounts = ({ t, open, onConnect, onCancel, isConnectionInProgress, updateAvalibleGrid }) => {
    const [accounts, setAccounts] = useState([]);

    const [quotas, setQuotas] = useState([]);

    const allAccountsFetchStatus = useSelector(state => state.AccountsStore.allAccountsFetchStatus);
    const allAccounts = useSelector(state => state.AccountsStore.allAccounts);

    useEffect(updateAvalibleGrid, []);

    useEffect(() => {
        const sortSelectAccountsList = _.sortBy(allAccounts, (o) => { return o.displayName; });
        setAccounts([...sortSelectAccountsList]);
    }, [allAccounts]);

    useEffect(()=> {
        setQuotas(accounts.filter(x => x.isChecked).map(el => ({ accountName: el.id,
            quotas: { compute: { description: el.displayName },
                storage: { description: el.displayName },
                networking: { description: el.displayName }
            }
        })));
}, [accounts]);

    const toggleCheckBox = (id) => {
        setAccounts(accounts.map(a => a.id === id ? { ...a, isChecked: !a.isChecked } : a));
    };

    const onConnectHandler = () => {
        onConnect(accounts.filter(x => x.isChecked).map(x => x.id), quotas);
    };

    const handleSearch = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        if (!value) { setAccounts(allAccounts); }

        setAccounts(allAccounts.filter(x =>
            x.displayName.toLowerCase().includes(value)
            || x.idIcdc.toLowerCase().includes(value)
            || x.name.toLowerCase().includes(value)
            || x.email.toLowerCase().includes(value)
            || x.phone.toLowerCase().includes(value)));
    }, [allAccounts]);

    const selectAccountsList = accounts.map((el) => (
        <Table.Row key={el.id} className='connectElements'>
            <Table.Cell style={{ paddingLeft: '0' }}>
                <label>
                    <input type='checkbox' value={el.isChecked} onClick={() => { toggleCheckBox(el.id); }} />
                    <span>
                        <div className='check-circle'></div>
                    </span>
                </label>
            </Table.Cell>
            <Table.Cell >{el.displayName}</Table.Cell>
            <Table.Cell>{el.idIcdc}</Table.Cell>
            <Table.Cell>{el.name}</Table.Cell>
            <Table.Cell>{el.email}</Table.Cell>
            <Table.Cell>{el.phone}</Table.Cell>
        </Table.Row>
    ));
    return (
        <Modal size='large' open={open}>
            <Modal.Content>
                <div className='close-btn' onClick={onCancel}></div>
                <label className='title'>{t('selectAccounts')}</label>
                <p className='description'>{t('connectDescription')}</p>
                <Input className='search'
                    icon='search'
                    iconPosition='left'
                    placeholder={t('search')}
                    onChange={handleSearch}
                    disabled={allAccounts.length === 0} />
                <div className='table-wrapper'>
                    {allAccountsFetchStatus !== 'fulfilled' ?
                        <Loader size='medium' active={allAccountsFetchStatus === 'pending'} inline='centered' />
                        :
                        <Table basic='very'>
                            <Table.Header className='connectAccount'>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>{t('name')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('techCont')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('email')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('phone')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {selectAccountsList}
                            </Table.Body>
                        </Table>}
                </div>
                <Modal.Actions className='btn-selectModal'>
                    <p><span>{accounts.filter(x => x.isChecked).length}</span>{t('selected')}</p>
                    <Button disabled={isConnectionInProgress}
                        content={t('cancel')}
                        onClick={onCancel} />
                    <Button disabled={isConnectionInProgress || accounts.filter(x => x.isChecked).length === 0}
                        color='blue'
                        content={t('connectSelected')}
                        onClick={onConnectHandler} />
                </Modal.Actions>
            </Modal.Content>
        </Modal>);
};

SelectAccounts.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    onConnect: PropTypes.func,
    onCancel: PropTypes.func,
    isConnectionInProgress: PropTypes.bool,
    allAccounts: PropTypes.array,
    updateAvalibleGrid: PropTypes.func
};

export default SelectAccounts;
