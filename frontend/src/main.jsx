import React from 'react';
import ReactDOM  from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import CheckoutPage from './pages/home/CheckoutPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.render(
  <React.StrictMode>
    <CheckoutPage />
  </React.StrictMode>,
  document.getElementById("root")
);
