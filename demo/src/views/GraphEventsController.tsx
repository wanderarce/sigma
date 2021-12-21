import { useRegisterEvents, useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import { CameraState } from "sigma/types";
import { Edge } from "../types";
import NodesPanel from "./NodesPanel";

function getMouseLayer() {
  return document.querySelector(".sigma-mouse");
}

const GraphEventsController: FC<{ edges: Edge[];
  setEdgesSelecteds:(edges: Edge[] | null) => void;
  setHoveredNode: (node: string | null) => void;
  setCurrentNode: (node: string | null) => void;
}> = ({setCurrentNode, edges, setEdgesSelecteds, setHoveredNode, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  
  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
      clickNode({ node }) {
        setCurrentNode(node);
        setHoveredNode(node);
        var temp = Array<Edge>();
           
        debugger
        edges.forEach((edge)=>{
          if(edge.edge[0] == node) {
            temp.push(edge);
          }
        });

        localStorage.setItem("edges",JSON.stringify(temp));
        setEdgesSelecteds(temp);
        if (!graph.getNodeAttribute(node, "hidden")) {   
          //window.open(graph.getNodeAttribute(node, "URL"), "_blank");
        }
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
