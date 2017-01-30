import React from 'react';
import StockList from './StockList.jsx';
import Menu from './Menu.jsx';
import StockOrder from './StockOrder.jsx';

export default class BarApp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            menus: ['Stock', 'Commandes']
        }
    }

    menuClick(state) {
        this.setState({mode: state});
    }

    render() {
        var content = null
        if (this.state.mode == 1) {
            content = <StockOrder bars={this.props.bars} session={this.props.session}/>
        }
        else {
            content = <StockList products={this.props.products} />;
        }
        return  <div>
                    <Menu items={this.state.menus} menuClick={(index)=>this.menuClick(index)} />
                    {content}
                    <button onClick={() => this.props.backClick()}>Back</button>
                </div>;
    }
}