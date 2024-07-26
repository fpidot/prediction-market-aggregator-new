import React, { useState } from 'react';
import axios from 'axios';
import { subscribeUser, confirmSubscription } from '../services/api';

const SubscriptionForm: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [alertTypes, setAlertTypes] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');

  console.log('API_BASE_URL:', process.env.REACT_APP_API_URL);
  console.log('Full subscription URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/subscription/subscribe`);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await subscribeUser(phoneNumber, categories, alertTypes);
      setMessage(response.message);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Error subscribing. Please try again.');
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await confirmSubscription(phoneNumber, confirmationCode);
      if (response.success) {
        setMessage(response.message);
        setShowConfirmation(false);
      } else {
        setMessage(response.message || 'Invalid confirmation code. Please try again.');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setMessage('Error confirming subscription. Please try again.');
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleAlertTypeChange = (type: string) => {
    setAlertTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div>
      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            required
          />
          <div>
            {['Elections', 'Economics', 'Geopolitics'].map(category => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="daily"
                checked={alertTypes.includes('daily')}
                onChange={() => handleAlertTypeChange('daily')}
              />
              Daily Updates
            </label>
            <label>
              <input
                type="checkbox"
                value="bigMove"
                checked={alertTypes.includes('bigMove')}
                onChange={() => handleAlertTypeChange('bigMove')}
              />
              Big Price Moves
            </label>
          </div>
          <button type="submit">Subscribe</button>
        </form>
      ) : (
        <form onSubmit={handleConfirmation}>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter confirmation code"
            required
          />
          <button type="submit">Confirm Subscription</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}; // Added closing curly brace and semicolon here

export default SubscriptionForm;