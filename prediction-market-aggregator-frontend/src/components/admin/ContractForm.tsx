import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createContract, updateContract } from '../../store/adminSlice';

interface ContractFormProps {
  contract?: any;
  onSubmit: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ contract, onSubmit }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState(contract || {
      name: '',
      description: '',
      category: '',
      currentPrice: 0,
      outcomes: [],
      displayOutcomes: 2
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      dispatch(updateContract({ id: contract.id, ...formData }));
    } else {
      dispatch(createContract(formData));
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Contract Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Elections">Elections</option>
        <option value="Economics">Economics</option>
        <option value="Geopolitics">Geopolitics</option>
      </select>
      <input
        type="number"
        name="currentPrice"
        value={formData.currentPrice}
        onChange={handleChange}
        placeholder="Current Price"
        required
      />
      <input
        type="number"
        name="displayOutcomes"
        value={formData.displayOutcomes}
        onChange={handleChange}
        placeholder="Display Outcomes"
        required
      />
      <button type="submit">{contract ? 'Update Contract' : 'Create Contract'}</button>
    </form>
  );
};

export default ContractForm;