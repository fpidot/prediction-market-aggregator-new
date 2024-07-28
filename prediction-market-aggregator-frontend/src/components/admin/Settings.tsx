import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, Settings as SettingsType } from '../../store/adminSlice';
import { RootState, AppDispatch } from '../../store';
import { Typography, TextField, Button, Grid, Paper } from '@mui/material';

interface SettingsFormData {
  bigMoveThreshold: number;
  dailyUpdateTime: string;
  dataRefreshFrequency: {
    [key: string]: number;
  };
  [key: string]: any;
}

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { settings, loading, error } = useSelector((state: RootState) => state.admin);
    const [formData, setFormData] = useState<SettingsType>({
      bigMoveThreshold: 0,
      dailyUpdateTime: '',
      topContractsToDisplay: 0,
      dataRefreshFrequency: {},
    });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name.includes('dataRefreshFrequency') ? 
        { ...prevState.dataRefreshFrequency, [name.split('.')[1]]: Number(value) } :
        name === 'dailyUpdateTime' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings(formData));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>System Settings</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="bigMoveThreshold"
              label="Big Move Threshold"
              type="number"
              value={formData.bigMoveThreshold}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="dailyUpdateTime"
              label="Daily Update Time"
              type="time"
              value={formData.dailyUpdateTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="topContractsToDisplay"
              label="Top Contracts to Display"
              type="number"
              value={formData.topContractsToDisplay}
              onChange={handleChange}
            />
          </Grid>
          {/* Add more fields for other settings */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Settings
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Settings;