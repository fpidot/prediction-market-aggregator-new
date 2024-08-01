import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';

if (typeof process === 'undefined' || !process.env) {
  (window as any).process = { 
    env: { 
      NODE_ENV: 'development',
      // Add any other environment variables your app uses
    } 
  };
}

// Log the initial state
console.log('Initial Redux State:', store.getState());

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