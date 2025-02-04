import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge } from './graphSlice';
import { AppDispatch, RootState } from './store';
import { updateGraphState } from './graphSlice';

interface NodeHistoryItem {
	nodeId: string;
	data: {
		position?: { x: number; y: number };
		color?: string;
		fontSize?: number;
		previousData?: {
			position?: { x: number; y: number };
			color?: string;
			fontSize?: number;
		};
	};
	action: string;
}

interface NodeHistory {
	past: NodeHistoryItem[];
	future: NodeHistoryItem[];
	initialState?: {
		position: { x: number; y: number };
		color: string;
		fontSize: number;
	};
}

interface HistoryState {
	// Sequential history (existing)
	past: Array<{
		nodes: Node[];
		edges: Edge[];
		action: string;
	}>;
	present: {
		nodes: Node[];
		edges: Edge[];
	} | null;
	future: Array<{
		nodes: Node[];
		edges: Edge[];
		action: string;
	}>;
	// Node-specific history (new)
	nodeHistory: {
		[nodeId: string]: NodeHistory;
	};
}

const initialState: HistoryState = {
	past: [],
	present: null,
	future: [],
	nodeHistory: {},
};

//this logState is used to log the state of the history slice
const logState = (prefix: string, state: unknown) => {
	console.log(`${prefix}:`, JSON.stringify(state, null, 2));
};

const historySlice = createSlice({
	name: "history",
	initialState,
	reducers: {
		initializeNodeHistory(
			state,
			action: PayloadAction<{
				nodeId: string;
				position: { x: number; y: number };
				color: string;
				fontSize: number;
			}>,
		) {
			if (!state.nodeHistory[action.payload.nodeId]) {
				state.nodeHistory[action.payload.nodeId] = {
					past: [],
					future: [],
					initialState: {
						position: action.payload.position,
						color: action.payload.color,
						fontSize: action.payload.fontSize,
					},
				};
				console.log(
					`\n--- Initialized history for Node ${action.payload.nodeId} ---`,
					JSON.stringify(state.nodeHistory[action.payload.nodeId], null, 2),
				);
			}
		},
		saveState(
			state,
			action: PayloadAction<{
				nodes: Node[];
				edges: Edge[];
				action: string;
				nodeId?: string;
				nodeData?: {
					position?: { x: number; y: number };
					color?: string;
					fontSize?: number;
				};
			}>,
		) {
			console.log('\n=== Saving Global State ===');
			console.log('Action:', action.payload.action);
			console.log('Current Global History:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);

			// Save to sequential history
			if (state.present) {
				state.past.push({
					nodes: JSON.parse(JSON.stringify(state.present.nodes)),
					edges: JSON.parse(JSON.stringify(state.present.edges)),
					action: action.payload.action,
				});
			}
			state.present = {
				nodes: JSON.parse(JSON.stringify(action.payload.nodes)),
				edges: JSON.parse(JSON.stringify(action.payload.edges)),
			};
			state.future = [];

			console.log('\nUpdated Global History:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);

			// Save to node-specific history if nodeId is provided
			if (action.payload.nodeId && action.payload.nodeData) {
				const nodeId = action.payload.nodeId;

				// Initialize node history if it doesn't exist
				if (!state.nodeHistory[nodeId]) {
					const node = action.payload.nodes.find((n) => n.id === nodeId);
					if (node) {
						state.nodeHistory[nodeId] = {
							past: [],
							future: [],
							initialState: {
								position: { ...node.position },
								color: node.data.color,
								fontSize: node.data.fontSize,
							},
						};
					}
				}

				const nodeHistory = state.nodeHistory[nodeId];
				if (nodeHistory) {
					// Get the current node state before the change
					const currentNode = state.present?.nodes.find((n) => n.id === nodeId);
					const previousData = {
						position: currentNode?.position,
						color: currentNode?.data?.color,
						fontSize: currentNode?.data?.fontSize,
					};

					nodeHistory.past.push({
						nodeId,
						data: {
							...action.payload.nodeData,
							previousData,
						},
						action: action.payload.action,
					});
					nodeHistory.future = [];

					console.log(`\nNode ${nodeId} History Update:`);
					logState('Initial State', nodeHistory.initialState);
					logState('Past States', nodeHistory.past);
					logState('Current Change', action.payload.nodeData);
					logState('Future States', nodeHistory.future);
				}
			}
		},
		undo(state) {
			if (state.past.length === 0 || !state.present) return;

			console.log('\n=== Global Undo ===');
			console.log('Before Undo:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);

			const previous = state.past[state.past.length - 1];
			const newPast = state.past.slice(0, -1);

			state.future.unshift({
				nodes: JSON.parse(JSON.stringify(state.present.nodes)),
				edges: JSON.parse(JSON.stringify(state.present.edges)),
				action: previous.action,
			});

			state.past = newPast;
			state.present = {
				nodes: JSON.parse(JSON.stringify(previous.nodes)),
				edges: JSON.parse(JSON.stringify(previous.edges)),
			};

			console.log('\nAfter Undo:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);
		},
		redo(state) {
			if (state.future.length === 0 || !state.present) return;

			console.log('\n=== Global Redo ===');
			console.log('Before Redo:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);

			const next = state.future[0];
			const newFuture = state.future.slice(1);

			state.past.push({
				nodes: JSON.parse(JSON.stringify(state.present.nodes)),
				edges: JSON.parse(JSON.stringify(state.present.edges)),
				action: next.action,
			});

			state.future = newFuture;
			state.present = {
				nodes: JSON.parse(JSON.stringify(next.nodes)),
				edges: JSON.parse(JSON.stringify(next.edges)),
			};

			console.log('\nAfter Redo:');
			logState('Past States', state.past);
			logState('Present State', state.present);
			logState('Future States', state.future);
		},
		undoNode(state, action: PayloadAction<string>) {
			const nodeId = action.payload;
			const nodeHistory = state.nodeHistory[nodeId];
			if (!nodeHistory || nodeHistory.past.length === 0 || !state.present) return;

			console.log(`\n=== Undoing Node ${nodeId} ===`);
			console.log('Before Undo:');
			logState('Past States', nodeHistory.past);
			logState('Future States', nodeHistory.future);

			const previous = nodeHistory.past[nodeHistory.past.length - 1];
			const node = state.present.nodes.find((n) => n.id === nodeId);
			if (!node || !previous.data.previousData) return;

			const currentState = {
				position: { ...node.position },
				color: node.data.color,
				fontSize: node.data.fontSize,
			};

			// Save current state to future
			nodeHistory.future.unshift({
				nodeId,
				data: {
					...currentState,
					previousData: previous.data,
				},
				action: previous.action,
			});

			// Restore previous state
			if (previous.data.previousData.position) {
				node.position = { ...previous.data.previousData.position };
			}
			if (previous.data.previousData.color) {
				node.data.color = previous.data.previousData.color;
			}
			if (previous.data.previousData.fontSize) {
				node.data.fontSize = previous.data.previousData.fontSize;
			}

			nodeHistory.past.pop();

			console.log('\nAfter Undo:');
			logState('Past States', nodeHistory.past);
			logState('Current Node State', {
				position: node.position,
				color: node.data.color,
				fontSize: node.data.fontSize,
			});
			logState('Future States', nodeHistory.future);
		},
		redoNode(state, action: PayloadAction<string>) {
			const nodeId = action.payload;
			const nodeHistory = state.nodeHistory[nodeId];
			if (!nodeHistory || nodeHistory.future.length === 0 || !state.present) return;

			console.log(`\n=== Redoing Node ${nodeId} ===`);
			console.log('Before Redo:');
			logState('Past States', nodeHistory.past);
			logState('Future States', nodeHistory.future);

			const next = nodeHistory.future[0];
			const node = state.present.nodes.find((n) => n.id === nodeId);
			if (!node) return;

			const currentState = {
				position: { ...node.position },
				color: node.data.color,
				fontSize: node.data.fontSize,
			};

			// Save current state to past
			nodeHistory.past.push({
				nodeId,
				data: {
					...currentState,
					previousData: next.data,
				},
				action: next.action,
			});

			// Apply next state
			if (next.data.position) {
				node.position = { ...next.data.position };
			}
			if (next.data.color) {
				node.data.color = next.data.color;
			}
			if (next.data.fontSize) {
				node.data.fontSize = next.data.fontSize;
			}

			nodeHistory.future.shift();

			console.log('\nAfter Redo:');
			logState('Past States', nodeHistory.past);
			logState('Current Node State', {
				position: node.position,
				color: node.data.color,
				fontSize: node.data.fontSize,
			});
			logState('Future States', nodeHistory.future);
		},
	},
});

// Thunk actions for sequential history
export const undoWithUpdate = () => (dispatch: AppDispatch, getState: () => RootState) => {
	dispatch(undo());
	const state = getState().history as HistoryState;
	if (state.present) {
		dispatch(updateGraphState(state.present));
	}
};

export const redoWithUpdate = () => (dispatch: AppDispatch, getState: () => RootState) => {
	dispatch(redo());
	const state = getState().history as HistoryState;
	if (state.present) {
		dispatch(updateGraphState(state.present));
	}
};

// Thunk actions for node-specific history
export const undoNodeWithUpdate =
	(nodeId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(undoNode(nodeId));
		const state = getState().history as HistoryState;
		if (state.present) {
			dispatch(updateGraphState(state.present));
		}
	};

export const redoNodeWithUpdate =
	(nodeId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(redoNode(nodeId));
		const state = getState().history as HistoryState;
		if (state.present) {
			dispatch(updateGraphState(state.present));
		}
	};

export const { saveState, undo, redo, undoNode, redoNode, initializeNodeHistory } =
	historySlice.actions;
export default historySlice.reducer;
