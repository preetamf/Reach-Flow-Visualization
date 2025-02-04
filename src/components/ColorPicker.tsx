import { memo, useCallback, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

interface ColorPickerProps {
	color: string;
	onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
	const [displayColorPicker, setDisplayColorPicker] = useState(false);

	const handleClick = useCallback(() => {
		setDisplayColorPicker((prev) => !prev);
	}, []);

	const handleClose = useCallback(() => {
		setDisplayColorPicker(false);
	}, []);

	const handleChange = useCallback(
		(colorResult: ColorResult) => {
			onChange(colorResult.hex);
		},
		[onChange],
	);

	const styles = {
		color: {
			width: '36px',
			height: '36px',
			borderRadius: '4px',
			background: color,
			cursor: 'pointer',
			border: '2px solid var(--border-color)',
		},
		popover: {
			position: 'absolute' as const,
			zIndex: 2,
			right: '0',
			top: '100%',
		},
		cover: {
			position: 'fixed' as const,
			top: '0px',
			right: '0px',
			bottom: '0px',
			left: '0px',
		},
	};

	return (
		<div className="color-picker">
			<label>Node Color:</label>
			<div style={{ position: 'relative' }}>
				<div style={styles.color} onClick={handleClick} />
				{displayColorPicker && (
					<div style={styles.popover}>
						<div style={styles.cover} onClick={handleClose} />
						<SketchPicker color={color} onChange={handleChange} />
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(ColorPicker);
