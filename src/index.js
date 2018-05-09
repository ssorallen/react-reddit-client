/* @flow */
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

const root = document.getElementById('root');
if (root == null) throw new Error('Missing #root element in the DOM');

ReactDOM.render(<App />, root);
