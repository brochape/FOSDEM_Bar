import React from 'react';
import Product from '../shared/Product.jsx';

export default class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: this.props.orders
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
				orders: this.state.orders.concat([order])
			})
		}
	}

	onClick(order) {
		this.props.session.call('order.finish', [order])
	}

	render() {
		let orders = this.state.orders.map((prod) => 
			<div key={prod.id}>
				<Product product={prod.product} quantity={prod.quantity} />
				<input type="checkbox" checked={prod.finished} onClick={() => this.onClick(prod)} />
			</div>)
		return 	<div>
					<h2>{this.props.bar}</h2>
					<div id="products">
						{orders}
					</div>
				</div>
	}
}