import React from 'react';
import { useAppSelector } from '../../hooks/redux';

const AdminDashboard: React.FC = () => {
  const { contracts, subscriptions } = useAppSelector((state) => state.admin);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Summary</h2>
        <p>Total Contracts: {contracts.length}</p>
        <p>Total Subscriptions: {subscriptions.length}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;