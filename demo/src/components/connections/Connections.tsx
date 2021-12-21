import React, { Component } from 'react';
import t from 'prop-types';
//import { inject, observer } from 'mobx-react';

interface IComponentProps {
    title?: string
    node?: any 
  }
  
  interface IComponentState {
}
class Connections extends Component<IComponentProps, IComponentState> {
    
    constructor(props:any) {
        debugger
        super(props);
        console.log(props);
    }
    handler(){
        this.setState((state) => {
            // Importante: use `state` em vez de `this.state` quando estiver atualizando.
            return {title: this.props.title + "a"}
          });
    }
    componentDidMount(){
        this.handler();
        console.log(this.props);
    }
    render() {
        if(this.props === undefined || this.props === null)
            return null;
        if(this.props!== undefined && this.props != null && this.props.title!== null)
            return ( <div className = "Connections" >
                {this.props.title}
            </div>
        );
    }
}
export default Connections;
//export default (observer(Connections));