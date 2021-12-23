import { useRegisterEvents, useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import { CameraState } from "sigma/types";
import { Child, Edge, NodeData } from "../types";
import { Attributes } from "graphology-types";

function getMouseLayer() {
  return document.querySelector(".sigma-mouse");
}

const GraphEventsController: FC<{ edges: Edge[];
  setEdgesSelecteds:(edges: Array<Edge>) => void;
  setHoveredNode: (node: string | null) => void;
  setConnections: (connections: Array<Attributes>) => void;
  
}> = ({edges, setEdgesSelecteds, setHoveredNode, setConnections, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  
  const getChildrens = (hoveredNode: string | null, edges: Edge[]) => {
    var eds = Array<Edge>();
    edges.forEach(edge =>{ 
      if(edge.edge[0].toString() === hoveredNode){
        debugger
        eds.push(edge);
      }
  });
    return eds;
  }

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
      clickNode({ node }) {
        setHoveredNode(node);
        setEdgesSelecteds(getChildrens(node, edges));
        if (!graph.getNodeAttribute(node, "hidden")) {   
          //window.open(graph.getNodeAttribute(node, "URL"), "_blank");
        }
        let connections= Array<Attributes>();
        graph.forEachNeighbor(node, function(neighbor, attributes) {
          debugger
          console.log(neighbor, attributes);
          connections.push(attributes);
        });
        setConnections(connections);
        
      },
      // enterNode({ node }) {
      //   setHoveredNode(node);
      //   // TODO: Find a better way to get the DOM mouse layer:
      //   const mouseLayer = getMouseLayer();
      //   if (mouseLayer) mouseLayer.classList.add("mouse-pointer");
      // },
      // leaveNode() {
      //   //setHoveredNode(null);
      //   // TODO: Find a better way to get the DOM mouse layer:
      //   const mouseLayer = getMouseLayer();
      //   if (mouseLayer) mouseLayer.classList.remove("mouse-pointer");
      // },
     
    });
  }, []);

  return <>{children}</>;
};

export default GraphEventsController;
