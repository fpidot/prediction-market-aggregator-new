import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchContracts, deleteContract, Contract } from '../../store/adminSlice';

const ContractList: React.FC = () => {
  const dispatch = useAppDispatch();
  const contracts = useAppSelector((state) => state.admin.contracts);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(id));
    }
  };

  return (
    <div className="contract-list">
      <h2>Contracts</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Current Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract: Contract) => (
            <tr key={contract._id}>
              <td>{contract.name}</td>
              <td>{contract.category}</td>
              <td>{contract.currentPrice}</td>
              <td>
                <button onClick={() => handleDelete(contract._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;