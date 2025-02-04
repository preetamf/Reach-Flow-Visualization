import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NodeStyleState {
  selectedNodeId: string | null;
  color: string;
  fontSize: number;
}

const initialState: NodeStyleState = {
  selectedNodeId: null,
  color: "#4d7cfe",
  fontSize: 16,
};

const nodeStyleSlice = createSlice({
  name: "nodeStyle",
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<string | null>) {
      state.selectedNodeId = action.payload;
    },
    updateColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    updateFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },
  },
});

export const { selectNode, updateColor, updateFontSize } = nodeStyleSlice.actions;
export default nodeStyleSlice.reducer;
