import React from 'react';
import Product from '../shared/Product.jsx';

export default class BarOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            old_orders: this.props.products.reduce((obj, prod) => {obj[prod.product] = 0; return obj}, {})
        }
    }

    handleClick() {
        var products = Object.keys(this.refs).map((key) => this.refs[key].values());
        products = products.filter((prod) => prod.quantity != 0);
        if (products.length > 0) {
            products.map((prod) => {
                const old_orders = this.state.old_orders
                old_orders[prod.product] += prod.quantity
                this.setState({
                    old_orders: old_orders
                })
                this.props.session.call('order.create', [{bar: this.props.assignment, 
                                                          product: prod.product, 
                                                          quantity: prod.quantity}])
            })
            Object.keys(this.refs).map((key) => this.refs[key].reset())
        }
    }

    render() {
        let old_orders = Object.keys(this.state.old_orders)
                               .map((key) => [key, this.state.old_orders[key]])
                               .sort((a, b) => b[1] - a[1])
                               .map((x) => x[0])
        var products = this.props.products.sort((a, b) => this.state.old_orders[b.product] - this.state.old_orders[a.product])
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