import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './MISC/Layout';
import config from './supabase-config';
import './input.css'; 

import HomeInvoice from './Invoice/HomeInvoice';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <HomeInvoice />
  </BrowserRouter>
);