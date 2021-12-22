import React, { Component, useEffect, useMemo, useState } from 'react';
import t from 'prop-types';
import { useSigma } from "react-sigma-v2";

//import { inject, observer } from 'mobx-react';

interface IComponentProps {
    title?: string
    currentNode?: any 
  }
  
  interface IComponentState {}

class Connections extends Component<IComponentProps, IComponentState> {
    //sigma = useState();
    //graph = sigma.getGraph();

    
    constructor(props:any) {
        super(props);
        console.log(props);
    }
    
    // nodesPerCluster = useMemo(() => {
    //     const index: Record<string, number> = {};
    //     graph.forEachNode((_, { cluster }) => (index[cluster] = (index[cluster] || 0) + 1));
    //     return index;
    //   }, []);
    

    render() {
        if(this.props === undefined || this.props === null)
            return null;
        if(this.props!== undefined && this.props != null && this.props.title!== null)
            return ( <div className = "Connections" >
                {this.props.currentNode}
            </div>
        );
    }
}
export default Connections;
//export default (observer(Connections));