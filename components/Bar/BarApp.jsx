import React from 'react';
import BarOrder from './BarOrder.jsx';
import ProductList from '../shared/ProductList.jsx';
import Menu from '../shared/Menu.jsx';

export default class BarApp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            menus: ['Stock', 'Commander']
        }
    }

    menuClick(state) {
        this.setState({mode: state})
    }

    render() {
        let content = null
        if (this.state.mode == 1) {
            content = <BarOrder assignment={this.props.assignment} products={this.props.products} session={this.props.session}/>
        }
        else {
            content = <ProductList products={this.props.products} />;
        }
        return  <div>
                    <Menu items={this.state.menus} menuClick={(index)=>this.menuClick(index)} />
                    {content}
                    <button onClick={() => this.props.backClick()}>Back</button>
                </div>;
    }
}