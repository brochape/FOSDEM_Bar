import React from 'react';
import ProductList from '../shared/ProductList.jsx';
import OrderList from '../shared/OrderList.jsx';

export default class StockOrder extends React.Component{
    constructor(props) {
        super(props);
        this.props.session.call('orders.pending.initial', []).then((orders) => this.initOrders(orders))
        this.props.session.subscribe('orders.onchange', (order) => this.onOrdersChange(order[0]))
    }

    initOrders(orders) {
        orders.forEach((order) => this.refs[order.bar].add_order(order))
    }

    onOrdersChange(order) {
        this.refs[order.bar].add_order(order)
    }

    render() {
        let n = this.props.bars.length
        let bars = this.props.bars.map((bar) => 
            <div className={"col-sm-" + 12 / n}>
                <OrderList key={bar} ref={bar} bar={bar} orders={[]} session={this.props.session} checkbox={true} />
            </div>)
        return  <div className={"container-fluid"}>
                    <div className="row">
                        {bars}
                    </div>
                </div>;
    }
}