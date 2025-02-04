import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import nodeStyleReducer from './nodeStyleSlice';
import historyReducer from './historySlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: {
		graph: graphReducer,
		nodeStyle: nodeStyleReducer,
		history: historyReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export custom hooks for better TypeScript support
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the state types for better type inference
export interface GraphState {
	nodes: any[];
	edges: any[];
	loading: boolean;
	error: string | null;
}

export interface NodeStyleState {
	selectedNodeId: string | null;
	color: string;
	fontSize: number;
}

export interface HistoryState {
	past: any[];
	present: any | null;
	future: any[];
} 