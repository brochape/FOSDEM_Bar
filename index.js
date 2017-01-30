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
                this.state.session.call('stock.initial', []).then((products) => this.updateProducts(products))
                this.state.session.subscribe('stock.onchange', (products) => this.updateProducts(products[0]))
            }
            catch (e) { // If error thrown => test_session function does not exist => server not running
                this.setState({server_running: false});
            }
        }

        this.connection.onclose = (r, d) => {
            this.setState({session: null})
        }

        this.connection.open()
    }

    updateProducts(products) {
        this.setState({server_running: true, products: products})
    }

    chooseAssigment(name) {
        this.setState({assignment: name});
    }

    render() {
        var content = null
        // session not working
        if (this.state.session == null) {
            content = "Could not open autobahn session"
        }
        // server not running
        else if (this.state.server_running == false) {
            content = "Server component is not running"
        }
        else {
            // choose an assignment
            if (this.state.assignment == null) {
                let choices = ["Stock"].concat(this.props.bars).map(
                    (name) => <button onClick={() => this.chooseAssigment(name)}>{name}</button>
                );
                content = <div>Choose your assignment<br />{choices}</div>
            }
            // stock app
            else if (this.state.assignment == "Stock") {
                content = <StockApp bars={this.props.bars}
                                    products={this.state.products}
                                    session={this.state.session}
                                    backClick={() => this.chooseAssigment(null)} />
            }
            // bar app
            else {
                content = <BarApp assignment={this.state.assignment}
                                    products={this.state.products}
                                    session={this.state.session}
                                    backClick={() => this.chooseAssigment(null)} />
            }
        }
        var assignment = ""
        if (this.state.assignment != null) {
            assignment = "You are assigned to " + this.state.assignment
        }
        return <div><h1>{assignment}</h1>{content}</div>
    }
};

let listBars = ['Bar 1', 'Bar 2'];

ReactDOM.render(
    <MyApp bars={listBars} />,
    document.getElementById('myapp'))