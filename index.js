var state = "Home"




var ListExample = React.createClass({

    changeState: function(newState){
        this.setState({mode: newState});
    },

    getInitialState: function(){
        return { mode: 0 };
    },

    render: function() {

        var self = this;
        var menuState = MenuExample.state
        var products = this.props.items[this.state.mode].map(function(s){
                return <Product name={s.name} quantity={s.quantity} active={s.active} />;
        });

        return <div>
                    <h1>Beer List</h1>
                    
                    <div id="products">
                        {products}


                    </div>

                </div>;

    }
});

var MenuExample = React.createClass({
    getInitialState: function(){
        return { focused: 0 };
    },

    clicked: function(index){
        this.setState({focused: index});
        ListExample.changeState(index);
    },

    render: function() {


        var self = this;


        return (
            <div>
                <ul>{ this.props.items.map(function(m, index){
        
                    var style = '';
        
                    if(self.state.focused == index){
                        style = 'focused';
                    }
        
                    return <li className={style} onClick={self.clicked.bind(self, index)}>{m}</li>;
        
                }) }
                        
                </ul>
                
                <div id="list"></div>
            </div>
        );

    }
});

var Product = React.createClass({

    getInitialState: function(){
        return { active: false };
    },

    render: function(){

        return  <p className={ this.state.active ? 'active' : '' }>
                    {this.props.name} <b>{this.props.quantity.toFixed(2)}</b>
                </p>;

    }

});

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
    <MenuExample items={ ['Home', 'Stocks', 'Commandes'] } />,
    document.getElementById('menu')
);

ReactDOM.render(
    <ListExample items ={ listItems } />,
    document.getElementById('list')
);

