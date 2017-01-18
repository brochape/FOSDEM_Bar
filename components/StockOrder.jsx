import React from 'react';
import ProductList from './ProductList.jsx';
import Order from './Order.jsx'

export default class StockOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orders: [{id: 5, from: 'bar1', products: [{product: 'jupiler', quantity: 10}, {product: 'leffe', quantity: 5}]}]
        }
    }

    render() {
        let orders = this.state.orders.map((order) => <Order order={order} session={this.props.session} />)
        return <div>
                    {orders}
                </div>;
    }
}