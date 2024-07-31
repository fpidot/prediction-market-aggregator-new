import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import ContractList from '../../components/admin/ContractList';
import SubscriptionList from '../../components/admin/SubscriptionList';
import ThresholdSettings from '../../components/admin/ThresholdSettings';
import MarketDiscovery from '../../components/admin/MarketDiscovery';
import Settings from '../../components/admin/Settings';

const AdminDashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <ContractList />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <SubscriptionList />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <ThresholdSettings />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <MarketDiscovery />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Settings />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;