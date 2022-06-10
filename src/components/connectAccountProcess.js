import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Modal } from 'semantic-ui-react';
import './locationAccount.scss';

const ConnectProcessModal = ({ t, open }) => (
    <Modal size='small' open={open} className='connectingAccounts'>
        <Modal.Content>
            <label className='title-connectingAccounts'>{t('connecting')}</label>
            <div className='descr-connectingAccounts'>
            <Loader size='medium' inline='centered' />    
                <span>{t('connectingMessage')}</span>
            </div>
        </Modal.Content>
    </Modal>
);

ConnectProcessModal.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool
};

export default ConnectProcessModal;
