import React from 'react';
import ReactDOM from 'react-dom';
import MyApp from './components/MyApp.jsx';

let listBars = ['Campouce', 'Janson', 'K'];

ReactDOM.render(
    <MyApp bars={listBars} />,
    document.getElementById('myapp'))