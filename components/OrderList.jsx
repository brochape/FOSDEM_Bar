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
        products = products.filter((prod) => prod.quantity != 0);
        if (products.length > 0) {
            this.props.session.call('order.create', [{'from': this.props.bar, 'products': products}])
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