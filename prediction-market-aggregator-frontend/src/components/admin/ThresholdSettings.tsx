import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchThresholds, updateThresholds } from '../../store/adminSlice';

const ThresholdSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const thresholds = useAppSelector((state) => state.admin.thresholds);
  const [formData, setFormData] = useState(thresholds);

  useEffect(() => {
    dispatch(fetchThresholds());
  }, [dispatch]);

  useEffect(() => {
    setFormData(thresholds);
  }, [thresholds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateThresholds(formData));
  };

  return (
    <div className="threshold-settings">
      <h2>Big Move Thresholds</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="hourlyThreshold">Hourly Threshold (%)</label>
          <input
            type="number"
            id="hourlyThreshold"
            name="hourlyThreshold"
            value={formData.hourlyThreshold}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>
        <div>
          <label htmlFor="dailyThreshold">Daily Threshold (%)</label>
          <input
            type="number"
            id="dailyThreshold"
            name="dailyThreshold"
            value={formData.dailyThreshold}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>
        <button type="submit">Update Thresholds</button>
      </form>
    </div>
  );
};

export default ThresholdSettings;