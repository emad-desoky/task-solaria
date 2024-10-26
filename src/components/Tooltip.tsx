import React from 'react';
import styles from './Tooltip.module.css'; // New CSS Module for Tooltip

interface PolygonData {
    code: number;
    status: string;
    price: number;
}

const Tooltip: React.FC<{ content: PolygonData; position: { x: number; y: number } }> = ({ content, position }) => (
    <div className={styles.tooltip} style={{ top: position.y, left: position.x }}>
        <div className={styles.tooltipContent}>
            <div><strong>Status:</strong> {content.status}</div>
            <div><strong>Price:</strong> ${content.price.toLocaleString()}</div>
        </div>
    </div>
);

export default Tooltip;
