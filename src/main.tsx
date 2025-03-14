
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced error handling
console.log('Application starting');

// Global error handlers for better debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Rejection details:', {
    message: event.reason?.message,
    stack: event.reason?.stack,
  });
});

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element with id "root"');
  throw new Error('Failed to find the root element');
}

// Create root and render app
console.log('Root element found, rendering app');
const root = createRoot(rootElement);
root.render(<App />);

console.log('App rendered to DOM');
