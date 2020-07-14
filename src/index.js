import React from 'react';
import ReactDOM from 'react-dom';
import { createOvermind } from 'overmind';
import { config } from './overmind';
import { Provider } from 'overmind-react';
import App from './components/App/App';
import './styles.scss';

const overmind = createOvermind(config);

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider value={overmind}>
    <App />
  </Provider>,
  rootElement
);
