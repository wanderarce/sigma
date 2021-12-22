import React, { FC, useEffect, useMemo, useState } from "react";
import { SigmaContainer, ZoomControl, FullScreenControl } from "react-sigma-v2";

import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { omit, mapValues, keyBy, constant } from "lodash";

import GraphSettingsController from "./GraphSettingsController";
import GraphEventsController from "./GraphEventsController";
import GraphDataController from "./GraphDataController";
import {  Dataset, Edge, FiltersState } from "../types";
import ClustersPanel from "./ClustersPanel";
import SearchField from "./SearchField";
import drawLabel from "../canvas-utils";
import GraphTitle from "./GraphTitle";
import TagsPanel from "./TagsPanel";
import "react-sigma-v2/lib/react-sigma-v2.css";
import { GrClose, GrGraphQl } from "react-icons/gr";
import { BiRadioCircleMarked, BiBookContent } from "react-icons/bi";
import { BsArrowsFullscreen, BsFullscreenExit, BsZoomIn, BsZoomOut } from "react-icons/bs";
import NodesPanel from "./NodesPanel";

const Root: FC = () => {
  const [showContents, setShowContents] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [edgesSelecteds, setEdgesSelecteds] = useState<Array<Edge>>([]);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
    nodes:{},
    edges: {}
  });
  const [connections, setConnections] = useState();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
 
  
  // Load data on mount:
  useEffect(() => {
    
    fetch(`${process.env.PUBLIC_URL}/dataset.json`)
      .then((res) => res.json())
      .then((dataset: Dataset) => {
        setDataset(dataset);
        setFiltersState({
          clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
          tags: mapValues(keyBy(dataset.tags, "key"), constant(true)),
          nodes: mapValues(keyBy(dataset.nodes, "key"), constant(true)),
          edges: mapValues(keyBy(dataset.edges, "edge"), constant(true)),
        });
        // setConnections({
        //   children: getChildrens(hoveredNode, dataset.edges)
        // });
        requestAnimationFrame(() => setDataReady(true));
      });
      
  }, []);

  
  if (!dataset) return null;

  return (
    <div id="app-root" className={showContents ? "show-contents" : ""}>
      <SigmaContainer
        graphOptions={{ type: "directed" }}
        initialSettings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode}  />
        <GraphEventsController 
          setHoveredNode={setHoveredNode} 
          edges={dataset.edges}
          setEdgesSelecteds={setEdgesSelecteds}
        />
        <GraphDataController dataset={dataset} filters={filtersState} />

        {dataReady && (
          <>
            <div className="controls">
              <div className="ico">
                <button
                  type="button"
                  className="show-contents"
                  onClick={() => setShowContents(true)}
                  title="Show caption and description"
                >
                  <BiBookContent />
                </button>
              </div>
              <FullScreenControl
                className="ico"
                customEnterFullScreen={<BsArrowsFullscreen />}
                customExitFullScreen={<BsFullscreenExit />}
              />
              <ZoomControl
                className="ico"
                customZoomIn={<BsZoomIn />}
                customZoomOut={<BsZoomOut />}
                customZoomCenter={<BiRadioCircleMarked />}
              />
              <div className="ico">
                <button
                  type="button"
                  className=""
                  onClick={() => setHoveredNode("")}
                  title="Reset Filters"
                >
                  <GrGraphQl />
                </button>
              </div>
            </div>

            <div className="contents">
              <div className="ico">
                <button
                  type="button"
                  className="ico hide-contents"
                  onClick={() => setShowContents(false)}
                  title="Show caption and description"
                >
                  <GrClose />
                </button>
              </div>
              <div className="ico">
                <button
                  type="button"
                  className="ico hide-contents"
                  onClick={() => setShowContents(false)}
                  title="Show caption and description"
                >
                  <GrClose />
                </button>
              </div>
              
              
              <GraphTitle filters={filtersState} />
              <div className="panels">
                <SearchField setHoveredNode={setHoveredNode} filters={filtersState} />
                {/* <DescriptionPanel /> */}
                <p> AA {edgesSelecteds}</p>
                 <NodesPanel
                  currentNode ={hoveredNode}
                  nodes={dataset.nodes}
                  edgesSelecteds={edgesSelecteds}
                  filters={filtersState}
                  setNodes={(nodes) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      nodes,
                    }))
                  }
                  toggleNode={(node) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      nodes: filters.nodes[node] 
                      ? omit(filters.nodes, node) 
                      : { ...filters.nodes, [node]: true },
                    }));
                  }}
                /> 
 
                {/* <Connections title={"bla"} currentNode={hoveredNode} 
                 /> */}
                <ClustersPanel
                  clusters={dataset.clusters}
                  filters={filtersState}
                  setClusters={(clusters) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters,
                    }))
                  }
                  toggleCluster={(cluster) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters: filters.clusters[cluster]
                        ? omit(filters.clusters, cluster)
                        : { ...filters.clusters, [cluster]: true },
                    }));
                  }}
                />
                <TagsPanel
                  tags={dataset.tags}
                  filters={filtersState}
                  setTags={(tags) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      tags,
                    }))
                  }
                  toggleTag={(tag) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      tags: filters.tags[tag] ? omit(filters.tags, tag) : { ...filters.tags, [tag]: true },
                    }));
                  }}
                />
              </div>
            </div>
          </>
        )}
      </SigmaContainer>
    </div>
  );
};

export default Root;




