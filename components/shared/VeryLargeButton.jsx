import React from 'react'

export default class VeryLargeButton extends React.Component {
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