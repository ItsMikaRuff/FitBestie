// StarRating.jsx
import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRate = () => {}, readOnly = false }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <span>
            {[...Array(5)].map((_, i) => (
                <span
                    key={i}
                    style={{
                        color: (hovered !== null ? i < hovered : i < Math.round(rating)) ? '#ffc107' : '#e4e5e9',
                        fontSize: '1.5em',
                        cursor: readOnly ? 'default' : 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={() => !readOnly && setHovered(i + 1)}
                    onMouseLeave={() => !readOnly && setHovered(null)}
                    onClick={() => !readOnly && onRate(i + 1)}
                >★</span>
            ))}
        </span>
    );
};

export default StarRating;