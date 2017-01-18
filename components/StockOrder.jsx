import React from 'react';
import Product from './Product.jsx';

export default class StockOrder extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let products = this.props.order.products.map((s,i) => <Product product={s.product} 
                                                                       quantity={s.quantity} />)
        return <div>
                    <h1>Order from {this.props.order.from}</h1>
                    <div id = "products" >
                        {products}
                    </div>
                </div>;
    }
}