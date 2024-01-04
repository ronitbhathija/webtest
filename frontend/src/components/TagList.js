// src/components/TagList.js
import React from 'react';

function TagList({ labels, selectedTags, onTagClick }) {
    return (
        <div>
            {labels.map((label) => (
                <button
                    key={label.id}
                    onClick={() => onTagClick(label.id)}
                    style={{ fontWeight: selectedTags.includes(label.id) ? 'bold' : 'normal' }}
                >
                    {label.label}
                </button>
            ))}
        </div>
    );
}

export default TagList;
