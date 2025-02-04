import { memo, useCallback } from 'react';
import { undoNodeWithUpdate, redoNodeWithUpdate } from '../store/historySlice';
import { RootState, HistoryState, useAppDispatch, useAppSelector } from '../store/store';

interface NodeUndoRedoControlsProps {
	selectedNodeId: string | null;
}

const NodeUndoRedoControls: React.FC<NodeUndoRedoControlsProps> = ({ selectedNodeId }) => {
	const dispatch = useAppDispatch();
	const { nodeHistory } = useAppSelector((state: RootState) => state.history as HistoryState);

	const selectedNodeHistory = selectedNodeId ? nodeHistory[selectedNodeId] : null;
	const canUndo = selectedNodeHistory?.past.length > 0;
	const canRedo = selectedNodeHistory?.future.length > 0;

	const handleNodeUndo = useCallback(() => {
		if (selectedNodeId) {
			dispatch(undoNodeWithUpdate(selectedNodeId));
		}
	}, [dispatch, selectedNodeId]);

	const handleNodeRedo = useCallback(() => {
		if (selectedNodeId) {
			dispatch(redoNodeWithUpdate(selectedNodeId));
		}
	}, [dispatch, selectedNodeId]);

	if (!selectedNodeId) return null;

	return (
		<div className="node-undo-redo-controls">
			<button onClick={handleNodeUndo} disabled={!canUndo}>
				<span className="material-icons">undo</span>
				Node Undo
			</button>
			<button onClick={handleNodeRedo} disabled={!canRedo}>
				<span className="material-icons">redo</span>
				Node Redo
			</button>
		</div>
	);
};

export default memo(NodeUndoRedoControls); 