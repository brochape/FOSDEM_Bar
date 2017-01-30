import React from 'react';
import ReactDOM from 'react-dom';
import MyApp from './components/MyApp.jsx';

let listBars = ['Bar 1', 'Bar 2'];

ReactDOM.render(
    <MyApp bars={listBars} />,
    document.getElementById('myapp'))