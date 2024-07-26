import React, { useState } from 'react';
import axios from 'axios';

interface ConfirmationFormProps {
  phoneNumber: string;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ phoneNumber }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/subscription/confirm', {
        phoneNumber,
        confirmationCode,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error confirming subscription. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        placeholder="Enter confirmation code"
        required
      />
      <button type="submit">Confirm Subscription</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ConfirmationForm;