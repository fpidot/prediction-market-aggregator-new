import React, { useState } from 'react';
import { subscribeUser } from '../services/api';

const SubscribePage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [alertTypes, setAlertTypes] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribeUser(phoneNumber, categories, alertTypes);
      alert('Subscription successful! Please check your phone for a confirmation message.');
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Subscribe to Alerts</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {/* Add checkboxes for categories and alert types */}
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default SubscribePage;