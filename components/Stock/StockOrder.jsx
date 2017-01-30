import React from 'react';
import ProductList from '../shared/ProductList.jsx';
import OrderList from './OrderList.jsx';

export default class StockOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
        this.props.session.call('orders.pending.initial', []).then((orders) => this.onOrdersChange(orders))
        this.props.session.subscribe('orders.pending.onchange', (orders) => this.onOrdersChange(orders[0]))
    }

    onOrdersChange(orders) {
        orders.forEach((order) => this.refs[order.bar].add_product(order))
    }

    render() {
        let bars = this.props.bars.map((bar) => 
            <OrderList key={bar} ref={bar} bar={bar} products={[]} session={this.props.session} />)
        return <div>
                    {bars}
                </div>;
    }
}