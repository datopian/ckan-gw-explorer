import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById('gw-dataexplorer') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App 
      ckanUrl={document.getElementById('gw-dataexplorer')?.getAttribute('data-ckan-url') || ''}
      resourceID={document.getElementById('gw-dataexplorer')?.getAttribute('data-resource-id') || ''}
    />
  </React.StrictMode>
);

