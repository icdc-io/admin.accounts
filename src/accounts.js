import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AccountsStore } from './AppReducer';
import './App.scss';

const AccountsInfo = React.lazy(() => import('./components/accounts'));

const Accounts = ({ t, store }) => {
  useEffect(() => {
    store.injectReducer('AccountsStore', AccountsStore);
  }, []);

  return <Provider store={store}>
    <Router basename={process.env.NODE_ENV === 'production' ? '/admin' : ''}>
      <AccountsInfo t={t} />
    </Router>
  </Provider>;
};

export default Accounts;
