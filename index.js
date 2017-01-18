import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';
import BarApp from './components/BarApp.jsx';
import StockApp from './components/StockApp.jsx';

class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            session: null,
            server_running: false,
            products: [],
            assignment: null
        };

        this.connection = new autobahn.Connection({
           url: "ws://127.0.0.1:8080/ws",
           realm: "realm1"
        });

        this.connection.onopen = (s, d) => {
            this.setState({session: s});
            try {
                this.state.session.call('stock.initial', []).then((stock) => 
                    this.setState({server_running: true, products: stock}));
                this.state.session.subscribe('stock.onchange', (stock) => 
                    this.setState({products: stock[0]}))
            }
            catch (e) { // If error thrown => test_session function does not exist => server not running
                this.setState({server_running: false,
                               products: {}});
            }
        }

        this.connection.onclose = (r, d) => {
            this.setState({session: null})
        }

        this.connection.open()
    }

    chooseAssigment(name) {
        this.setState({assignment: name});
    }

    render() {
        // session not working
        if (this.state.session == null) {
            return <div>Could not open autobahn session</div>;
        }
        // server not running
        else if (this.state.server_running == false) {
            return <div>Server component is not running</div>;
        }
        else {
            // choose an assignment
            if (this.state.assignment == null) {
                let choices = ["Stock"].concat(this.props.bars).map(
                    (name) => <button onClick={() => this.chooseAssigment(name)}>{name}</button>
                );
                return <div>Choose your assignment<br />{choices}</div>
            }
            // stock app
            else if (this.state.assignment == "Stock") {
                return <div><StockApp products={this.state.products}
                                      session={this.state.session}
                                      backClick={() => this.chooseAssigment(null)} /></div>
            }
            // bar app
            else {
                return <div><BarApp assignment={this.state.assignment}
                                    products={this.state.products}
                                    session={this.state.session}
                                    backClick={() => this.chooseAssigment(null)} /></div>
            }
        }
    }
};

let listBars = ['Bar 1', 'Bar 2'];

ReactDOM.render(
    <MyApp bars={listBars} />,
    document.getElementById('myapp'))