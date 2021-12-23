import React, { FC, useEffect, useMemo, useState } from "react";
import { MdBusiness } from "react-icons/md";

import { Edge, FiltersState, NodeData } from "../types";
import { useSigma } from "react-sigma-v2";
import { keyBy, mapValues, sortBy, values } from "lodash";
import Panel from "./Panel";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/all";
import { Attributes } from "graphology-types";

const NodesPanel: FC<{
  currentNode:any;
  connections: Array<Attributes>;
  nodes: NodeData[];
  edgesSelecteds: Array<Edge>;
  filters: FiltersState;
  toggleNode: (node: number) => void;
  setNodes: (nodes: Record<number, boolean>) => void;
}> = ({ currentNode, nodes, connections, edgesSelecteds, filters, toggleNode, setNodes }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  
  const nodesPerNode = useMemo(() => {
    const index: Record<string, number> = {};

    graph.forEachNode((_, { key }) => {
      (index[key] = (index[key] || 0) + 1);
    });
    return index;
  }, []);

  const maxNodesPerNode = useMemo(() => Math.max(...values(nodesPerNode)), [nodesPerNode]);
  const visibleNodesCount = useMemo(() => Object.keys(filters.nodes).length, [filters]);

  const [visibleNodesPerNode, setVisibleNodesPerNode] = useState<Record<number, number>>(nodesPerNode);
  const [nodeSelected, setNodeSelected] = useState<NodeData | null>(null);

  useEffect(() => {
    // To ensure the graphology instance has up to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<number, number> = {};
      
      graph.forEachNode((node, { key, hidden }) => {
          !hidden && (index[key] = (index[key] || 0) + 1);  
      
      });
      setVisibleNodesPerNode(index);
      if(currentNode !== undefined && currentNode !== null && currentNode !== ''){
        graph.forEachNeighbor(currentNode, function(neighbor, attributes) {
          console.log(neighbor, attributes);
        });
      }
      
    });
  }, [filters]);

  const sortedNodes = useMemo(
    () => sortBy(nodes, (node) => (node.key === undefined ? Infinity : -nodesPerNode[node.key])),
    [nodes, nodesPerNode],
  );

  

  return (
    <Panel
      title={
        <>
          <MdBusiness className="text" /> Connections
          {visibleNodesCount < nodes.length ? (
            <span className="text-muted text-small">
              {" "}
              ({visibleNodesCount} / {nodes.length})
            </span>
          ) : (
            ""
          )}
        </>
      }
    >
      <p>
        <i className="text-muted">Click a company to show/hide related pages from the network.</i>
      </p>
      <p className="buttons">
        <button className="btn" onClick={() => setNodes(mapValues(keyBy(nodes, "edge"), () => true))}>
          <AiOutlineCheckCircle /> Check all
        </button>{" "}
        <button className="btn" onClick={() => setNodes({})}>
          <AiOutlineCloseCircle /> Uncheck all
        </button>
      </p>
      <p>Nó atual: {currentNode}</p>
      
      <ul>
        {sortedNodes.map((node) => {
          if(currentNode !== undefined && currentNode !== null && currentNode == node.key){
            const nodesCount = nodesPerNode[node.key];
          const visibleNodesCount = visibleNodesPerNode[node.key] || 0;
          return (
            <li
              className="caption-row card"
              key={node.key}
              title={`${nodesCount} page${nodesCount > 1 ? "s" : ""}${
                visibleNodesCount !== nodesCount ? ` (only ${visibleNodesCount} visible)` : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters.nodes[node.key] || false}
                onChange={() => {toggleNode(node.key); setNodeSelected(node)}}
                id={`node-${node.key}`}
              />
              <label htmlFor={`node-${node.key}`}>
                <span
                  className="circle"
                  style={{ background: "#333" }}
                />{" "}
                <div className="node-label">
                  <span>{node.label}</span>
                  <div className="bar" style={{ width: (100 * nodesCount) / maxNodesPerNode + "%" }}>
                    <div
                      className="inside-bar"
                      style={{
                        width: (100 * visibleNodesCount) / nodesCount + "%",
                      }}
                    />
                  </div>
                </div>
              </label>
              <p><a href={node.URL} target="_blank" className="linkedin">Linkedin</a></p>
              <p><b>Company: </b> {node.tag}</p>
              <p><b>Office: </b> {node.cluster}</p>
              
            </li>
          );
          } else{
            return null;
          }
          
          
        })}
      </ul>
      <p>Linked connections</p>
      <ul>
        {connections.map((node) =>{
          return (
            <li
              className="caption-row"
              key={node.key}
              title={`${connections.length} page${connections.length > 1 ? "s" : ""}${
                visibleNodesCount !== connections.length ? ` (only ${visibleNodesCount} visible)` : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters.nodes[node.key] || false}
                onChange={() => {toggleNode(node.key);}}
                id={`node-${node.key}`}
              />
              <label htmlFor={`node-${node.key}`}>
                <span
                  className="circle"
                  style={{ background: "#333" }}
                />{" "}
                <div className="node-label">
                  <span>{node.label}</span>
                  <div className="bar" style={{ width: (100 * connections.length) / maxNodesPerNode + "%" }}>
                    <div
                      className="inside-bar"
                      style={{
                        width: (100 * visibleNodesCount) / connections.length + "%",
                      }}
                    />
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      
      </ul>
    </Panel>
  );
};

export default NodesPanel;
