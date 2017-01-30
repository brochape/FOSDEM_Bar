import React from 'react';
import Product from './Product.jsx';

export default class BarOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            products: this.props.products.map((s,i) => <Product ref={i}
                                                                product={s.product} 
                                                                quantity={0}
                                                                inc={true}
                                                                dec={true} />)
        }
    }

    handleClick() {
        var products = Object.keys(this.refs).map((key) => this.refs[key].values());
        products = products.filter((prod) => prod.quantity != 0);
        if (products.length > 0) {
            products.map((prod) => 
                this.props.session.call('order.create', [{bar: this.props.assignment, 
                                                          product: prod.product, 
                                                          quantity: prod.quantity}]))

            Object.keys(this.refs).map((key) => this.refs[key].reset());
        }
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