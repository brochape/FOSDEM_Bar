import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';
import ProductList from './components/ProductList.jsx';
import BarOrder from './components/BarOrder.jsx';
import Menu from './components/Menu.jsx';

class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            mode: 0,
            session: null,
            server_running: false,
            assignment: null
        };

        this.connection = new autobahn.Connection({
           url: "ws://127.0.0.1:8080/ws",
           realm: "realm1"
        });

        this.connection.onopen = (s, d) => {
            this.setState({session: s});
            try {
                this.state.session.call('ping_server', []).then((res) => this.setState({server_running: true}));
            }
            catch (e) { // If error thrown => test_session function does not exist => server not running
                this.setState({server_running: false});
            }
        }

        this.connection.onclose = (r, d) => {

        }

        this.connection.open()
    }

    handleChange(state) {
        this.setState({mode: state});
    }

    chooseAssigment(name) {
        this.setState({assignment: name});
    }

    render() {
        if (this.state.session == null) {
            return <div>Could not open autobahn session</div>;
        }
        else if (this.state.server_running == false) {
            return <div>Server component is not running</div>;
        }
        else {
            if (this.state.assignment == null) {
                let choices = ["Stock"].concat(this.props.bars).map(
                    (name) => <button onClick={() => this.chooseAssigment(name)}>{name}</button>
                );
                return <div>Choose your assignment<br />{choices}</div>
            }
            else if (this.state.assignment == "Stock") {
                return <div>TBD</div>
            }
            else {
                const products = this.props.products[this.state.mode];
                let list = this.state.mode == 2 ?
                                   <BarOrder bar={this.state.assignment} items={products} session={this.state.session}/> : 
                                   <ProductList items={products} />;
                return  <div>
                            <Menu items={this.props.menus} handleChange={(index)=>this.handleChange(index)} />
                            {list}
                        </div>;
            }
        }
    }
};

let listItems = [
        [
            { name: 'Kriek', quantity: 220 }
        ],
        [
            { name: 'Jupiler', quantity: 300 },
            { name: 'Orval', quantity: 400 },
            { name: 'Barbar', quantity: 250 },
            { name: 'Kriek', quantity: 220 }
        ],
        [
            { name: 'Jupiler', quantity: 0 },
            { name: 'Orval', quantity: 0 },
            { name: 'Barbar', quantity: 0 },
            { name: 'Kriek', quantity: 0 }
        ]
    ];


let listBars = ['Bar 1', 'Bar 2'];

ReactDOM.render(
    <MyApp bars={listBars} menus={['Home', 'Stocks', 'Commandes']} products={listItems} />,
    document.getElementById('myapp'))