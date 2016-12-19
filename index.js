import React from 'react';
import ReactDOM from 'react-dom';



class ListExample extends React.Component {
    render() {
        var products = this.props.items.map((s) =>{
                return <Product name={s.name} quantity={s.quantity} active={s.active} />;
        });

        return <div>
                    <h1>Beer List</h1>
                    <div id = "products" >
                        {products}
                    </div>
                </div>;
    }
};

class MenuExample extends React.Component {
    constructor(props){
        super(props);
        this.state = { focused : 0 };
    }

    clicked(index){
        this.setState({focused: index});
    }

    render() {
        return (
            <div>
                <ul>{ this.props.items.map((m, index) => {        
                    var style = '';
        
                    if(this.state.focused == index){
                        style = 'focused';
                    }
        
                    return <li className={style} onClick={()=>{

                        this.props.handleChange(index);
                        this.clicked(index);

                    }}>{m}</li>;
                }) }
                        
                </ul>
            </div>
        );


    }
};

class Product extends React.Component {

    constructor(props){
        super(props);
        this.state = { active: false };
    }

    render(){

        return  <p className={ this.state.active ? 'active' : '' }>
                    {this.props.name} <b>{this.props.quantity.toFixed(2)}</b>
                </p>;

    }

};


class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { mode: 0 };
    }

    handleChange(state) {
        this.setState({mode: state});
    }

    render() {
        return  <div>
                    <MenuExample items={this.props.menus} handleChange={this.handleChange} />
                    <ListExample items={this.props.products[this.state.mode]} />
                </div>;
    }
};

var listItems = [
        [

        ],
        [
            { name: 'Jupiler', quantity: 300 },
            { name: 'Orval', quantity: 400 },
            { name: 'Barbar', quantity: 250 },
            { name: 'Kriek', quantity: 220 }
        ],
        [
            {
                name: 'test', quantity: 100
            }
        ]
    ];


ReactDOM.render(
    <MyApp menus={['Home', 'Stocks', 'Commandes']} products={listItems} />,
    document.getElementById('myapp'))