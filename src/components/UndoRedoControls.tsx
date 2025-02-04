import { memo, useCallback } from 'react';
import { undoWithUpdate, redoWithUpdate } from '../store/historySlice';
import { RootState, HistoryState, useAppDispatch, useAppSelector } from '../store/store';

const UndoRedoControls: React.FC = () => {
	const dispatch = useAppDispatch();
	const { past, future } = useAppSelector((state: RootState) => state.history as HistoryState);

	const handleUndo = useCallback(() => {
		dispatch(undoWithUpdate());
	}, [dispatch]);

	const handleRedo = useCallback(() => {
		dispatch(redoWithUpdate());
	}, [dispatch]);

	return (
		<div className="undo-redo-controls">
			<button onClick={handleUndo} disabled={past.length === 0}>
				<span className="material-icons">undo</span>
				Undo
			</button>
			<button onClick={handleRedo} disabled={future.length === 0}>
				<span className="material-icons">redo</span>
				Redo
			</button>
		</div>
	);
};

export default memo(UndoRedoControls);
