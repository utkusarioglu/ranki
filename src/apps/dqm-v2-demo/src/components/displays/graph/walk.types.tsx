export interface N {
  data: {
    id: number;
    label: string;
  };
  classes: string;
}

export interface E {
  data: {
    source: number;
    target: number;
    label: string;
  };
  classes: string;
}

export interface ProduceNodesReturn {
  ast: N;
  subtreeEdges: E[];
  subtree: ProduceNodesReturn[];
}
