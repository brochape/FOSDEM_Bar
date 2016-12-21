import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';


class StockList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var products = this.props.items.map((s,i) =>{
            return <Product name={s.name} quantity={s.quantity} />;
        });

        return <div>
                    <h1>Beer List</h1>
                    <div id = "products" >
                        {products}
                    </div>
                </div>;
    }
};

class OrderList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            products: this.props.items.map((s,i) => <Product ref={i}
                                                             name={s.name} 
                                                             quantity={s.quantity}
                                                             inc={true}
                                                             dec={true} />)
        }
    }

    handleClick() {
        var products = Object.keys(this.refs).map((key) => this.refs[key].values());
        Promise.all(products.map((order) => order['quantity'] != 0 ? 
                                            this.props.session.call('order.create', [order]) : 
                                            null));
        Object.keys(this.refs).map((key) => this.refs[key].reset());
    }

    render() {
        return <div>
                    <h1>Beer List</h1>
                    <div id = "products" >
                        {this.state.products}
                        <button id="order" onClick={() => this.handleClick()}>Order</button>
                    </div>
                </div>;
    }
}

class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = { focused : 0 };
    }

    clicked(index){
        this.setState({focused: index});
    }

    render() {
        return (
            <div>
                <ul>{ this.props.items.map((m, index) => {        
                    var style = '';
        
                    if(this.state.focused == index){
                        style = 'focused';
                    }
        
                    return <li className={style} onClick={()=>{

                        this.props.handleChange(index);
                        this.clicked(index);

                    }}>{m}</li>;
                }) }
                        
                </ul>
            </div>
        );


    }
};

class Product extends React.Component {

    constructor(props){
        super(props);
        this.state = {quantity: 0};
    }


    inc(){
        this.setState({quantity: this.state.quantity + 1});
    }

    dec(){
        if (this.state.quantity > 0) {
            this.setState({quantity: this.state.quantity - 1});
        }
    }

    values() {
        return {
            product: this.props.name,
            quantity: this.state.quantity
        };
    }

    reset() {
        this.setState({quantity: 0});
    }

    render(){
        var buttons = [];
        if (this.props.inc) {
            buttons.push(<button onClick={() => this.inc()}>+</button>);
        }
        if (this.props.dec) {
            buttons.push(<button onClick={() => this.dec()}>-</button>);
        }
        return  <p>
                    {this.props.name} {buttons[0]}<b>{this.state.quantity}</b>{buttons[1]}
                </p>;

    }

};


class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            mode: 2,
            session: null
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

    render() {
        const products = this.props.products[this.state.mode];
        var list = this.state.mode == 2 ?
                           <OrderList items={products} session={this.state.session}/> : 
                           <StockList items={products} />;
        return  <div>
                    <Menu items={this.props.menus} handleChange={(index)=>this.handleChange(index)} />
                    {list}
                </div>;
    }
};

var listItems = [
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


ReactDOM.render(
    <MyApp menus={['Home', 'Stocks', 'Commandes']} products={listItems} />,
    document.getElementById('myapp'))