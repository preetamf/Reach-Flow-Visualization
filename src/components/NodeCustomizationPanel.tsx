import { memo, useCallback } from 'react';
import { RootState, GraphState, NodeStyleState, useAppDispatch, useAppSelector } from '../store/store';
import { updateNodeStyle } from '../store/graphSlice';
import ColorPicker from './ColorPicker';
import FontSizeControl from './FontSizeControl';
import { saveState } from '../store/historySlice';
import NodeUndoRedoControls from './NodeUndoRedoControls';
import UndoRedoControls from './UndoRedoControls';

interface Node {
	id: string;
	data: {
		label: string;
		color: string;
		fontSize: number;
	};
}

const NodeCustomizationPanel: React.FC = () => {
	const dispatch = useAppDispatch();
	const { selectedNodeId } = useAppSelector((state: RootState) => state.nodeStyle as NodeStyleState);
	const { nodes, edges } = useAppSelector((state: RootState) => state.graph as GraphState);

	const selectedNode = nodes.find((node: Node) => node.id === selectedNodeId);

	const handleColorChange = useCallback(
		(color: string) => {
			if (selectedNodeId) {
				dispatch(updateNodeStyle({ id: selectedNodeId, color }));
				dispatch(
					saveState({
						nodes,
						edges,
						action: `CHANGE_COLOR_NODE_${selectedNodeId}`,
						nodeId: selectedNodeId,
						nodeData: { color },
					}),
				);
			}
		},
		[dispatch, selectedNodeId, nodes, edges],
	);

	const handleFontSizeChange = useCallback(
		(fontSize: number) => {
			if (selectedNodeId) {
				dispatch(updateNodeStyle({ id: selectedNodeId, fontSize }));
				dispatch(
					saveState({
						nodes,
						edges,
						action: `CHANGE_FONT_SIZE_NODE_${selectedNodeId}`,
						nodeId: selectedNodeId,
						nodeData: { fontSize },
					}),
				);
			}
		},
		[dispatch, selectedNodeId, nodes, edges],
	);

	if (!selectedNode) {
		return (
			<div className="customization-panel">
				<h2>Node Customization</h2>
				<p>Select a node to customize its appearance.</p>
				<div className="history-controls">
					<h3>Global History</h3>
					<UndoRedoControls />
				</div>
			</div>
		);
	}

	return (
		<div className="customization-panel">
			<h2>Node Customization</h2>
			<div className="selected-node-info">
				<span className="label">Selected:</span>
				<span className="value">{selectedNode.data.label}</span>
			</div>
			<div className="panel-content">
				<ColorPicker color={selectedNode.data.color} onChange={handleColorChange} />
				<FontSizeControl
					fontSize={selectedNode.data.fontSize}
					onChange={handleFontSizeChange}
				/>
				<div className="history-controls">
					<div className="history-section">
						<h3>Node History</h3>
						<NodeUndoRedoControls selectedNodeId={selectedNodeId} />
					</div>
					<div className="history-section">
						<h3>Global History</h3>
						<UndoRedoControls />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(NodeCustomizationPanel);
