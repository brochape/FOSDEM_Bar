import React from 'react';

export default class Product extends React.Component {

    constructor(props){
        super(props);
        this.state = {quantity: 0};
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
            product: this.props.name,
            quantity: this.state.quantity
        };
    }

    reset() {
        this.setState({quantity: 0});
    }

    render(){
        var buttons = [];
        if (this.props.inc) {
            buttons.push(<button onClick={() => this.inc()}>+</button>);
        }
        if (this.props.dec) {
            buttons.push(<button onClick={() => this.dec()}>-</button>);
        }
        return  <p>
                    {this.props.name} {buttons[0]}<b>{this.state.quantity}</b>{buttons[1]}
                </p>;

    }

};