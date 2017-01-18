import React from 'react';
import VeryLargeButton from './VeryLargeButton.jsx';
import ProductList from './ProductList.jsx'

export default class Order extends React.Component {
    constructor(props){
        super(props);
    }

    finishOrder() {
        
    }

    render(){
        return  <div>
                    {this.props.order.from}
                    <ProductList products={this.props.order.products} />
                    <div className="vlg">
                        <VeryLargeButton right onClick={() => this.finishOrder()}>Finish order</VeryLargeButton>
                    </div>
                </div>;
    }

};