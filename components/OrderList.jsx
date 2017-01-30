import React from 'react';
import ProductList from './ProductList.jsx';

export default class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: this.props.products
		}
	}

	add_product(product) {
		let products = this.state.products;
		products.push(product)
		this.setState({
			products: products
		})
	}

	render() {
		return <div>
			<h2>{this.props.bar}</h2>
			<ProductList products={this.state.products} />
		</div>
	}
}