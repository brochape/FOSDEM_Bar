import React from 'react';
import Product from '../shared/Product.jsx';

export default class BarOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            // internal state to keep track of what has been ordered
            old_orders: this.props.products.reduce((obj, prod) => {obj[prod.product] = 0; return obj}, {})
        }
    }

    handleClick() {
        // get list of product/quantity objects
        var products = Object.keys(this.refs).map((key) => this.refs[key].values());
        products = products.filter((prod) => prod.quantity != 0);
        if (products.length > 0) {
            products.forEach((prod) => {
                // keep internal state of what has been ordered (for sorting)
                const old_orders = this.state.old_orders
                old_orders[prod.product] += prod.quantity
                this.setState({
                    old_orders: old_orders
                })
                // notify the server of the order
                this.props.session.call('order.create', [{bar: this.props.assignment, 
                                                          product: prod.product, 
                                                          quantity: prod.quantity}])
            })
            // reset the quantities to 0
            Object.keys(this.refs).forEach((key) => this.refs[key].reset())
        }
    }

    render() {
        // sort products by most ordered
        var products = this.props.products.sort((a, b) => this.state.old_orders[b.product] - this.state.old_orders[a.product])
        // create DOM elements for products
        products = products.map((prod) => <Product  key={prod.product}
                                                    ref={prod.product}
                                                    product={prod.product} 
                                                    quantity={0}
                                                    inc={true}
                                                    dec={true} />)
        return <div>
                    <h1>Beer List</h1>
                    <div id = "products" >
                        {products}
                        <button id="order" onClick={() => this.handleClick()}>Order</button>
                    </div>
                </div>;
    }
}