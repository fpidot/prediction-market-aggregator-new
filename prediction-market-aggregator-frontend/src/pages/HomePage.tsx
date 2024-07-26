import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Container, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { fetchContractsAsync, updateContracts, Contract, selectAllContracts, selectContractsStatus, selectContractsError } from '../store/contractsSlice';
import { AppDispatch } from '../store';
import SubscriptionForm from '../components/SubscriptionForm';

const categories = ['Elections', 'Economics', 'Geopolitics'];

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contracts = useSelector(selectAllContracts);
  const status = useSelector(selectContractsStatus);
  const error = useSelector(selectContractsError);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    dispatch(fetchContractsAsync());
  
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    ws.onmessage = async (event) => {
      console.log('Received WebSocket message');
      try {
        let text: string;
        if (event.data instanceof Blob) {
          text = await new Response(event.data).text();
        } else {
          text = event.data;
        }
        console.log('Message content:', text);
        if (text) {
          const updatedContracts: Contract[] = JSON.parse(text);
          console.log('Updating contracts:', updatedContracts.map((c: Contract) => ({ name: c.name, price: c.currentPrice })));
          dispatch(updateContracts(updatedContracts));
        } else {
          console.warn('Received empty message');
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };
  
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [dispatch]);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
  };

  const filteredContracts = contracts.filter(
    (contract: Contract) => contract.category === categories[selectedCategory]
  );

  const renderPriceChange = (change: number) => (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      {change > 0 ? (
        <ArrowDropUp sx={{ color: 'success.main' }} />
      ) : (
        <ArrowDropDown sx={{ color: 'error.main' }} />
      )}
      <Typography
        component="span"
        sx={{ color: change > 0 ? 'success.main' : 'error.main' }}
      >
        {Math.abs(change).toFixed(2)}¢
      </Typography>
    </Box>
  );

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Prediction Market Aggregator
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={selectedCategory} onChange={handleCategoryChange} aria-label="contract categories">
          {categories.map((category, index) => (
            <Tab label={category} key={index} />
          ))}
        </Tabs>
      </Box>
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Typography color="error">{error}</Typography>}
      {status === 'succeeded' && (
        <>
          <Typography variant="h6" gutterBottom>
            {categories[selectedCategory]} Contracts:
          </Typography>
          {filteredContracts.length === 0 ? (
            <Typography>No contracts available for this category at the moment.</Typography>
          ) : (
            <List>
              {filteredContracts.map((contract: Contract) => (
                <ListItem key={contract._id} divider>
                  <ListItemText
                    primary={contract.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Current Price: ${contract.currentPrice.toFixed(2)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          1h Change: {renderPriceChange(contract.oneHourChange)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          24h Change: {renderPriceChange(contract.twentyFourHourChange)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
      <SubscriptionForm />
    </Container>
  );
};

export default HomePage;