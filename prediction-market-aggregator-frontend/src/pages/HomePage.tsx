import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractsAsync, updateContracts, selectAllContracts } from '../store/contractsSlice';
import { AppDispatch } from '../store';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import SubscriptionForm from '../components/SubscriptionForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contracts = useSelector(selectAllContracts);
  const [wsConnected, setWsConnected] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.type === 'PRICE_UPDATE') {
        console.log('Updating contracts:', data.contracts);
        dispatch(updateContracts(data.contracts));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWsConnected(false);
      setTimeout(connectWebSocket, 5000); // Try to reconnect after 5 seconds
    };

    return ws;
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContractsAsync());
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [dispatch, connectWebSocket]);


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderContracts = (category: string) => {
    return contracts
      .filter(contract => contract.category === category)
      .map((contract) => (
        <Box key={contract._id} sx={{ mb: 2 }}>
          <Typography variant="h6">{contract.name}</Typography>
          <Typography>Current Price: {contract.currentPrice?.toFixed(2) ?? 'N/A'}</Typography>
          <Typography>1 Hour Change: {contract.oneHourChange?.toFixed(2) ?? 'N/A'}%</Typography>
          <Typography>24 Hour Change: {contract.twentyFourHourChange?.toFixed(2) ?? 'N/A'}%</Typography>
        </Box>
      ));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Prediction Market Aggregator</Typography>
      <Typography sx={{ mb: 2 }}>WebSocket status: {wsConnected ? 'Connected' : 'Disconnected'}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="contract categories">
          <Tab label="Elections" />
          <Tab label="Economics" />
          <Tab label="Geopolitics" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderContracts('Elections')}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderContracts('Economics')}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderContracts('Geopolitics')}
      </TabPanel>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Subscribe to Alerts</Typography>
        <SubscriptionForm />
      </Box>
    </Box>
  );
};

export default HomePage;