import { memo, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
	Background,
	Controls,
	NodeChange,
	NodeTypes,
	Node as FlowNode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { updateNodePosition, setLoading, setError } from '../store/graphSlice';
import { saveState, initializeNodeHistory } from '../store/historySlice';
import { RootState, GraphState, useAppDispatch, useAppSelector } from '../store/store';
import { selectNode } from '../store/nodeStyleSlice';
import CustomNode from './CustomNode';
import ErrorBoundary from './ErrorBoundary';

const nodeTypes: NodeTypes = {
	customNode: CustomNode,
};

interface DragState {
	nodeId: string | null;
	startPosition: { x: number; y: number } | null;
}

const GraphContainer: React.FC = () => {
	const dispatch = useAppDispatch();
	const { nodes, edges, loading, error } = useAppSelector(
		(state: RootState) => state.graph as GraphState,
	);

	// Ref to track drag state
	const dragStateRef = useRef<DragState>({
		nodeId: null,
		startPosition: null,
	});

	useEffect(() => {
		// Initialize history for each node
		nodes.forEach((node) => {
			dispatch(
				initializeNodeHistory({
					nodeId: node.id,
					position: node.position,
					color: node.data.color,
					fontSize: node.data.fontSize,
				}),
			);
		});

		// Save initial state to history
		dispatch(saveState({ nodes, edges, action: 'INITIAL_STATE' }));
	}, []);

	const onNodeDragStart = useCallback((event: React.MouseEvent, node: FlowNode) => {
		dragStateRef.current = {
			nodeId: node.id,
			startPosition: { ...node.position },
		};
	}, []);

	const onNodeDragStop = useCallback(
		(event: React.MouseEvent, node: FlowNode) => {
			// Only save state if the position actually changed
			if (
				dragStateRef.current.nodeId === node.id &&
				dragStateRef.current.startPosition &&
				(dragStateRef.current.startPosition.x !== node.position.x ||
					dragStateRef.current.startPosition.y !== node.position.y)
			) {
				dispatch(
					updateNodePosition({
						id: node.id,
						position: node.position,
					}),
				);
				dispatch(
					saveState({
						nodes,
						edges,
						action: `MOVE_NODE_${node.id}`,
						nodeId: node.id,
						nodeData: { position: node.position },
					}),
				);
			}
			dragStateRef.current = { nodeId: null, startPosition: null };
		},
		[dispatch, nodes, edges],
	);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => {
			try {
				dispatch(setLoading(true));
				const nodeChange = changes[0];
				if (nodeChange.type === 'position' && nodeChange.position) {
					dispatch(
						updateNodePosition({
							id: nodeChange.id as string,
							position: nodeChange.position,
						}),
					);
				}
			} catch (err) {
				dispatch(setError((err as Error).message));
			} finally {
				dispatch(setLoading(false));
			}
		},
		[dispatch],
	);

	const onPaneClick = useCallback(() => {
		// Deselect node when clicking on the background
		dispatch(selectNode(null));
	}, [dispatch]);

	if (error) {
		return <div className="error-message">Error: {error}</div>;
	}

	return (
		<ErrorBoundary>
			<div className="graph-container" style={{ height: '100%', width: '100%' }}>
				{loading && <div className="loading-overlay">Loading...</div>}
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onNodeDragStart={onNodeDragStart}
					onNodeDragStop={onNodeDragStop}
					onPaneClick={onPaneClick}
					nodeTypes={nodeTypes}
					fitView
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</ErrorBoundary>
	);
};

export default memo(GraphContainer); 