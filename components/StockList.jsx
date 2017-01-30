import React from 'react';
import ProductList from './ProductList.jsx';

export default class StockList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return 	<div>
					<h1>Beer List</h1>
					<ProductList products={this.props.products} />
				</div>
	}
}