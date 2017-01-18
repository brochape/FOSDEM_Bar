import React from 'react';
import ProductList from './ProductList.jsx';
import Order from './Order.jsx'

export default class StockOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
        this.props.session.call('orders.finished.initial', []).then((orders) => 
            this.setState({
                orders: orders
            }))
    }

    render() {
        let orders = this.state.orders.map((order) => <Order order={order} session={this.props.session} />)
        return <div>
                    {orders}
                </div>;
    }
}