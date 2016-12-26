import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';
import StockList from './components/StockList.jsx';
import OrderList from './components/OrderList.jsx';
import Menu from './components/Menu.jsx';

class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            mode: 0,
            session: null,
            assignment: null
        };

        this.connection = new autobahn.Connection({
           url: "ws://127.0.0.1:8080/ws",
           realm: "realm1"
        });

        this.connection.onopen = (s, d) => {
            this.setState({session: s});
        }

        this.connection.onclose = (r, d) => {

        }

        this.connection.open()
    }

    handleChange(state) {
        this.setState({mode: state});
    }

    chooseAssigment(name) {
        console.log(name);
        this.setState({assignment: name});
    }

    render() {
        if (this.state.session == null) {
            return <div>Could not open autobahn session</div>;
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
                                   <OrderList bar={this.state.assignment} items={products} session={this.state.session}/> : 
                                   <StockList items={products} />;
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