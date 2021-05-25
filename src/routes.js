import React from 'react';


const Account = React.lazy(() => import('./views/dashboard/Account'));
const Transactions = React.lazy(() => import('./views/dashboard/Transactions'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: Account },
  { path: '/account', name: 'Account', component: Account },
  { path: '/transactions', name: 'Transactions', component: Transactions },
];

export default routes;
