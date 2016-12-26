import React from 'react';
import ProductList from './ProductList.jsx';
import Menu from './Menu.jsx';

export default class BarApp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 0
        }
    }

    menuClick(state) {
        this.setState({mode: state});
    }

    render() {
        const products = this.props.products;
        var content = null
        if (this.state.mode == 2) {
            //content = <BarOrder assignment={this.props.assignment} products={products} session={this.props.session}/>
        }
        else {
            content = <ProductList products={products} />;
        }
        return  <div>
                    <Menu items={this.props.menus} menuClick={(index)=>this.menuClick(index)} />
                    {content}
                    <button onClick={() => this.props.backClick()}>Back</button>
                </div>;
    }
}