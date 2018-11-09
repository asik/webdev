import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router'

ReactDOM.render(
  // Render the component within a Route to give it access to history
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>,
  document.getElementById('root'));
