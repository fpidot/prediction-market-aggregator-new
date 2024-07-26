import React from 'react';
import ContractList from '../../components/admin/ContractList';
import ContractForm from '../../components/admin/ContractForm';

const ContractManagement: React.FC = () => {
  return (
    <div>
      <h1>Contract Management</h1>
      <ContractForm onSubmit={() => {}} />
      <ContractList />
    </div>
  );
};

export default ContractManagement;