import React from 'react';

class VeryLargeButton extends React.Component {
    constructor(props){
        super(props)
        let v = 'vlg-button'
        let l = (props.left) ? 'left' : 'right'
        this.bclass = `${v} ${v}-${l} ${props.className}`
    }

    render(){
        return <div className={this.bclass} {...this.props}>
                   {this.props.children}
               </div>
    }
}

export default class Product extends React.Component {

    constructor(props){
        super(props);
        this.state = {quantity: this.props.quantity};
    }


    inc(){
        this.setState({quantity: this.state.quantity + 1});
    }

    dec(){
        if (this.state.quantity > 0) {
            this.setState({quantity: this.state.quantity - 1});
        }
    }

    values() {
        return {
            product: this.props.product,
            quantity: this.state.quantity
        };
    }

    reset() {
        this.setState({quantity: 0});
    }

    render(){
        var buttons = [];
        if (this.props.inc) {
            buttons.push(<VeryLargeButton left onClick={() => this.inc()}>+</VeryLargeButton>);
        }
        if (this.props.dec) {
            buttons.push(<VeryLargeButton right onClick={() => this.dec()}>-</VeryLargeButton>);
        }
        return  <div>
                    <div className="productname">
                        {this.props.product} <b>{this.state.quantity}</b>
                    </div>
                    <div className="vlg">
                        {buttons}
                    </div>
                </div>;


    }

};