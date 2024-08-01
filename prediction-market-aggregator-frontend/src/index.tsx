import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';

console.log('Initial Redux State:', store.getState());

// Log environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Log the initial state
console.log('Initial Redux State:', store.getState());

// Log the store configuration
console.log('Store configuration:', store.getState());
console.log('Admin reducer:', store.getState().admin);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Subscribe to state changes
store.subscribe(() => console.log('Updated Redux State:', store.getState()));