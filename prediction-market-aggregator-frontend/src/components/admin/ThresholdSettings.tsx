import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThresholds, updateThresholds, Thresholds } from '../../store/adminSlice';
import { RootState, AppDispatch } from '../../store';

const ThresholdSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const thresholds = useSelector((state: RootState) => state.admin.thresholds);
  const [formData, setFormData] = useState<Thresholds>({
    hourlyThreshold: 0,
    dailyThreshold: 0,
  });

  useEffect(() => {
    dispatch(fetchThresholds());
  }, [dispatch]);

  useEffect(() => {
    if (thresholds) {
      setFormData(thresholds);
    }
  }, [thresholds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateThresholds(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="hourlyThreshold">Hourly Threshold:</label>
        <input
          type="number"
          id="hourlyThreshold"
          name="hourlyThreshold"
          value={formData.hourlyThreshold}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="dailyThreshold">Daily Threshold:</label>
        <input
          type="number"
          id="dailyThreshold"
          name="dailyThreshold"
          value={formData.dailyThreshold}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Update Thresholds</button>
    </form>
  );
};

export default ThresholdSettings;