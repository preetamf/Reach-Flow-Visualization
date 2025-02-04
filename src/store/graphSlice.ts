import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Node {
  id: string;
  position: { x: number; y: number };
  data: { label: string; color: string; fontSize: number };
  type?: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
}

// Helper function to generate a grid layout
const generateGridLayout = (numNodes: number) => {
  const nodesPerRow = Math.ceil(Math.sqrt(numNodes));
  const spacing = 150;
  return Array.from({ length: numNodes }, (_, i) => ({
    id: `node-${i + 1}`,
    position: {
      x: (i % nodesPerRow) * spacing + 100,
      y: Math.floor(i / nodesPerRow) * spacing + 100,
    },
    data: {
      label: `Node ${i + 1}`,
      color: '#4d7cfe',
      fontSize: 16,
    },
    type: 'customNode',
  }));
};

// Helper function to generate interconnected edges
const generateEdges = (numNodes: number) => {
  const edges: Edge[] = [];
  for (let i = 1; i <= numNodes; i++) {
    // Connect to next node
    if (i < numNodes) {
      edges.push({
        id: `edge-${i}-${i + 1}`,
        source: `node-${i}`,
        target: `node-${i + 1}`,
        type: 'smoothstep',
        animated: false,
      });
    }
    // Connect to node two steps ahead to create more connections
    if (i < numNodes - 1) {
      edges.push({
        id: `edge-${i}-${i + 2}`,
        source: `node-${i}`,
        target: `node-${i + 2}`,
        type: 'smoothstep',
        animated: false,
      });
    }
  }
  return edges;
};

const initialState: GraphState = {
  nodes: generateGridLayout(10),
  edges: generateEdges(10),
  loading: false,
  error: null,
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateNodePosition(state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) {
      const node = state.nodes.find((n) => n.id === action.payload.id);
      if (node) node.position = action.payload.position;
    },
    updateNodeStyle(state, action: PayloadAction<{ id: string; color?: string; fontSize?: number }>) {
      const node = state.nodes.find((n) => n.id === action.payload.id);
      if (node) {
        if (action.payload.color !== undefined) {
          node.data.color = action.payload.color;
        }
        if (action.payload.fontSize !== undefined) {
          node.data.fontSize = action.payload.fontSize;
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateGraphState(
      state,
      action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>,
    ) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
  },
});

export const { updateNodePosition, updateNodeStyle, setLoading, setError, updateGraphState } = graphSlice.actions;
export default graphSlice.reducer;
