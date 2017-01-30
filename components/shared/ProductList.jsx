import React from 'react';
import Product from './Product.jsx';

export default class ProductList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var products = this.props.products.map((prod) => 
            <Product product={prod.product} quantity={prod.quantity} />);

        return  <div id="products">
                    {products}
                </div>
    }
};