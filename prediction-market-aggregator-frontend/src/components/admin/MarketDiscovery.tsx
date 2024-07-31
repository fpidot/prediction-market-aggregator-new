import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { triggerDiscovery, manualDiscovery } from '../../store/adminSlice';
import { AppDispatch, RootState } from '../../store';

const MarketDiscovery: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const discoveryResults = useSelector((state: RootState) => state.admin.discoveryResults);

    const handleTriggerDiscovery = () => {
        dispatch(triggerDiscovery());
      };
    
      const handleManualDiscovery = () => {
        dispatch(manualDiscovery({ keyword, category }));
      };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Market Discovery</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleTriggerDiscovery}>
            Trigger Scheduled Discovery
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleManualDiscovery}>
            Manual Discovery
          </Button>
        </Grid>
      </Grid>
      {discoveryResults && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Discovered {discoveryResults.length} new markets
        </Typography>
      )}
    </Paper>
  );
};

export default MarketDiscovery;