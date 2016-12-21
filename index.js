import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';


var connection = new autobahn.Connection({
   url: "ws://127.0.0.1:8080/ws",
   realm: "realm1"
});

var session = null;

connection.onopen = (s, d) => {
    session = s;
}

connection.onclose = (r, d) => {

}

connection.open()

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
        this.state = {items: this.props.items}
    }

    handleClick() {
        var toSend = this.state.items.map((order) => { var neworder = {};
                                                     neworder['product'] = order['name'];
                                                     neworder['quantity'] = order['quantity'];
                                                     return neworder;
                                                   });
        Promise.all(toSend.map((order) => order['quantity'] != 0 ? session.call('order.create', [order])
                                                                 : null));
        this.setState({items: this.state.items.map((order) => { order['quantity'] = 0; return order })});
    }

    render() {

        var products = this.state.items.map((s,i) =>{
            return <Product name={s.name} 
                            quantity={s.quantity} 
                            inc= {()=>this.inc(i)}
                            dec= {()=>this.dec(i)}/>;
        });

        return <div>
                    <h1>Beer List</h1>
                    <div id = "products" >
                        {products}
                        <button id="order" onClick={() => this.handleClick()}>Order</button>
                    </div>
                </div>;
    }


    inc(index){
        var newItems = this.state.items;
        newItems[index].quantity++;
        this.setState({items: newItems});
    }

    dec(index){
        var newItems = this.state.items;
        newItems[index].quantity = Math.max(0,newItems[index].quantity-1);
        this.setState({items: newItems});
    }
}

class MenuExample extends React.Component {
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

class VeryLargeButton extends React.Component {
    constructor(props){
        super(props)
        let v = 'vlg-button'
        let l = (props.left) ? 'left' : 'right'
        this.bclass = `${v} ${v}-${l} ${props.className}`
    }

    render(){
        return <div className={this.bclass} {...this.props}>
                   {this.props.children}
               </div>
    }
}

class Product extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        var buttons = [];
        if (this.props.inc) {
            buttons.push(<VeryLargeButton left onClick={this.props.inc}>+</VeryLargeButton>);
        }
        console.log(buttons);
        if (this.props.dec) {
            buttons.push(<VeryLargeButton right onClick={this.props.dec}>-</VeryLargeButton>);
        }
        return  <div>
                    {this.props.name} <b>{this.props.quantity}</b>
                    <div className="vlg">
                        {buttons}
                    </div>
                </div>;
    }

};


class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = { mode: 0 };
    }

    handleChange(state) {
        this.setState({mode: state});
    }

    render() {
        const products = this.props.products[this.state.mode];
        var list = this.state.mode == 2 ?
                           <OrderList items={products} /> : 
                           <StockList items={products} />;
        return  <div>
                    <MenuExample items={this.props.menus} handleChange={(index)=>this.handleChange(index)} />
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