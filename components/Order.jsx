import React from 'react';
import VeryLargeButton from './VeryLargeButton.jsx';
import ProductList from './ProductList.jsx'

export default class Order extends React.Component {
    constructor(props){
        super(props);
    }

    finishOrder() {
        this.props.session.call('order.finish', [this.props.order])
    }

    render(){
        return  <div>
                    <h1>Order from : {this.props.order.from}</h1>
                    <ProductList products={this.props.order.products} />
                    <button id="order" onClick={() => this.finishOrder()}>Finish Order</button>
                </div>;
    }

};