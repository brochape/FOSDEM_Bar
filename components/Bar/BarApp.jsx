import React from 'react';
import BarOrder from './BarOrder.jsx';
import ProductList from '../shared/ProductList.jsx';
import Menu from '../shared/Menu.jsx';
import OrderList from '../shared/OrderList.jsx';

export default class BarApp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            menus: ['Stock', 'Commander', 'Commandes en cours'],
            orders: []
        }
        this.props.session.call('orders.pending.initial', []).then((orders) => this.initOrders(orders))
        this.props.session.subscribe('orders.onchange', (order) => this.onOrdersChange(order[0]))
    }

    menuClick(state) {
        this.setState({mode: state})
    }

    add_order(order) {
        let orders = []
        let exists = false
        this.setState({
            orders: this.state.orders.map((o) => {
                        if (o.id == order.id) {
                            o.finished = order.finished
                            exists = true
                        }
                        return o
                    })
        })
        if (!exists) {
            this.setState({
                orders: [order].concat(this.state.orders)
            })
        }
    }

    initOrders(orders) {
        orders.forEach((order) => {
            if (order.bar == this.props.assignment) this.add_order(order)
        })
    }

    onOrdersChange(order) {
        if (order.bar == this.props.assignment) {
            this.add_order(order)
        }
    }

    add_order(order) {
        let orders = []
        let exists = false
        this.setState({
            orders: this.state.orders.map((o) => {
                        if (o.id == order.id) {
                            o.finished = order.finished
                            exists = true
                        }
                        return o
                    })
        })
        if (!exists) {
            this.setState({
                orders: [order].concat(this.state.orders)
            })
        }
    }

    render() {
        let content = null
        if (this.state.mode == 0) {
            content = <ProductList products={this.props.products} />
        }
        else if (this.state.mode == 1) {
            content = <BarOrder assignment={this.props.assignment} products={this.props.products} session={this.props.session} />
        }
        else if (this.state.mode == 2) {
            content =  <OrderList   bar={this.props.assignment}
                                    orders={this.state.orders} 
                                    session={this.props.session} />
        }
        return  <div>
                    <Menu items={this.state.menus} menuClick={(index)=>this.menuClick(index)} />
                    {content}
                    <button className={"mybutton btn"} onClick={() => this.props.backClick()}>Back</button>
                </div>;
    }
}