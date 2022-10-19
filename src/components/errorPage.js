import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment, Header } from 'semantic-ui-react';

const ErrorPage = ({ t, auth }) => <Segment placeholder className='error-content'>
    <Header icon>
        <Icon name='exclamation triangle' size='huge' />
        <h2>{t([auth ? 'denied' : 'error'])}</h2>
        <h6>{t([auth ? 'noAccess' : 'errorDescription'])}</h6>
    </Header>
</Segment>;

ErrorPage.propTypes = {
    t: PropTypes.func,
    auth: PropTypes.bool
};

export default ErrorPage;
