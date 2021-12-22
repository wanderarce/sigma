export interface NodeData {
  key: number;
  label: string;
  tag: string;
  URL: string;
  cluster: string;
  x: number;
  y: number;
}

export interface Cluster {
  key: string;
  color: string;
  clusterLabel: string;
}

export interface Tag {
  key: string;
  image: string;
}

export interface Edge{
  edge: Array<number>;
  size: number;
}

export interface Dataset {
  nodes: NodeData[];
  edges: Edge[];
  clusters: Cluster[];
  tags: Tag[];
}

export interface FiltersState {
  clusters: Record<string, boolean>;
  tags: Record<string, boolean>;
  nodes: Record<number, boolean>;
  edges: Record<string, boolean>;
}


export interface Connection{
  children: Record<number, Child[]>; 
}

export interface Child {
  node: NodeData;
  size: number;
}