import React from 'react';
import Product from './Product.jsx';

export default class ProductList extends React.Component {
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