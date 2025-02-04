import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { selectNode } from '../store/nodeStyleSlice';
import { RootState } from '../store/store';

const CustomNode = ({ id, data }: NodeProps) => {
	const dispatch = useDispatch();
	const selectedNodeId = useSelector((state: RootState) => state.nodeStyle.selectedNodeId);

	const handleNodeClick = useCallback(() => {
		dispatch(selectNode(id));
	}, [dispatch, id]);

	const isSelected = selectedNodeId === id;

	return (
		<div
			style={{
				padding: '10px',
				borderRadius: '8px',
				backgroundColor: data.color || '#4d7cfe',
				border: isSelected ? '2px solid #ffffff' : '2px solid transparent',
				color: '#ffffff',
				fontSize: `${data.fontSize}px`,
				minWidth: '100px',
				textAlign: 'center',
				cursor: 'pointer',
				transition: 'all 0.2s ease',
			}}
			onClick={handleNodeClick}
		>
			<Handle type="target" position={Position.Top} style={{ background: '#ffffff' }} />
			{data.label}
			<Handle type="source" position={Position.Bottom} style={{ background: '#ffffff' }} />
		</div>
	);
};

export default memo(CustomNode); 