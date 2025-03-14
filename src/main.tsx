
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// For debugging
console.log('Application starting, looking for root element');

// Get the root element and handle null case
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

// Create root and render app
console.log('Root element found, rendering app');
const root = createRoot(rootElement);
root.render(<App />);
