import React, { useState, useEffect } from 'react';
import './BlinkingEmoji.css';

const BlinkingEmoji = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const randomX = Math.floor(Math.random() * (window.innerWidth - 100));
        const randomY = Math.floor(Math.random() * (window.innerHeight - 100));
        setPosition({ x: randomX, y: randomY });

        const interval = setInterval(() => {
            setOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));

            const newX = Math.floor(Math.random() * (window.innerWidth - 100));
            const newY = Math.floor(Math.random() * (window.innerHeight - 100));
            setPosition({ x: newX, y: newY });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="blinking-emoji"
            style={{
                left: position.x,
                top: position.y,
                opacity: opacity,
            }}
        >
            👀
        </div>
    );
};

export default BlinkingEmoji;