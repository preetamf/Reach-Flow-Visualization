import { memo, useCallback } from 'react';

interface FontSizeControlProps {
	fontSize: number;
	onChange: (size: number) => void;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];

const FontSizeControl: React.FC<FontSizeControlProps> = ({ fontSize, onChange }) => {
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			const newSize = parseInt(event.target.value, 10);
			if (!isNaN(newSize) && newSize >= 12 && newSize <= 24) {
				onChange(newSize);
			}
		},
		[onChange],
	);

	return (
		<div className="font-size-control">
			<label htmlFor="font-size">Font Size:</label>
			<select
				id="font-size"
				value={fontSize}
				onChange={handleChange}
				className="font-size-select"
			>
				{FONT_SIZES.map((size) => (
					<option key={size} value={size}>
						{size}px
					</option>
				))}
			</select>
		</div>
	);
};

export default memo(FontSizeControl);
