import React, { useState } from 'react';
import { submitSubscription, confirmSubscription } from '../services/api';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Box, Typography } from '@mui/material';

const SubscriptionForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const categories = ['Elections', 'Economics', 'Geopolitics'];
  const alertTypes = ['Daily Update', 'Big Move'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await submitSubscription({ phoneNumber, categories: selectedCategories, alertTypes: selectedAlertTypes });
      if (response.awaitingConfirmation) {
        setAwaitingConfirmation(true);
        alert('Please enter the confirmation code sent to your phone.');
      } else {
        alert(response.message); // This will show "Subscription updated" or "New subscription created"
        resetForm();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Error submitting subscription. Please try again.');
    }
  };

  const handleConfirmation = async () => {
    try {
      const response = await confirmSubscription({ phoneNumber, confirmationCode });
      alert(response.message);
      resetForm();
    } catch (error) {
      console.error('Confirmation error:', error);
      alert('Error confirming subscription. Please try again.');
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setSelectedCategories([]);
    setSelectedAlertTypes([]);
    setConfirmationCode('');
    setAwaitingConfirmation(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAlertTypeChange = (alertType: string) => {
    setSelectedAlertTypes(prev =>
      prev.includes(alertType)
        ? prev.filter(a => a !== alertType)
        : [...prev, alertType]
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Phone Number"
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        fullWidth
      />
      {!awaitingConfirmation && (
        <>
          <Typography variant="subtitle1">Categories:</Typography>
          <FormGroup>
            {categories.map(category => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
          <Typography variant="subtitle1">Alert Types:</Typography>
          <FormGroup>
            {alertTypes.map(alertType => (
              <FormControlLabel
                key={alertType}
                control={
                  <Checkbox
                    checked={selectedAlertTypes.includes(alertType)}
                    onChange={() => handleAlertTypeChange(alertType)}
                  />
                }
                label={alertType}
              />
            ))}
          </FormGroup>
        </>
      )}
      {awaitingConfirmation ? (
        <>
          <TextField
            label="Confirmation Code"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            fullWidth
          />
          <Button onClick={handleConfirmation} variant="contained">Confirm Subscription</Button>
        </>
      ) : (
        <Button type="submit" variant="contained">Subscribe</Button>
      )}
    </Box>
  );
};

export default SubscriptionForm;