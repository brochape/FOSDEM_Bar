import React from 'react';
import Product from './Product.jsx';

export default class OrderList extends React.Component{

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