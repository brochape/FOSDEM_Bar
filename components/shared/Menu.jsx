import React from 'react';

export default class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = { focused : 0 };
    }

    clicked(index){
        this.props.menuClick(index);
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

                        this.clicked(index);

                    }}>{m}</li>;
                }) }
                        
                </ul>
            </div>
        );


    }
};