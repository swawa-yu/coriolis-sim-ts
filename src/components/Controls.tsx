import React, { useState } from 'react';

interface ControlsProps {
    onStartSimulation: (longitude: number, latitude: number, speed: number, direction: number, animationSpeed: number) => void;
    onAnimationSpeedChange: (animationSpeed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ onStartSimulation, onAnimationSpeedChange }) => {
    const [longitude, setLongitude] = useState(135);
    const [latitude, setLatitude] = useState(0);
    const [speed, setSpeed] = useState(100);
    const [direction, setDirection] = useState(30);
    const [animationSpeed, setAnimationSpeed] = useState(1);

    const handleStart = () => {
        onStartSimulation(longitude, latitude, speed, direction, animationSpeed);
    };

    const handleAnimationSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = Number(e.target.value);
        setAnimationSpeed(newSpeed);
        onAnimationSpeedChange(newSpeed);
    };

    return (
        <div id="controls">
            <h2>初期条件</h2>
            <label>
                経度: <input type="number" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} min="-180" max="180" />
            </label>
            <label>
                緯度: <input type="number" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} min="-90" max="90" />
            </label>
            <label>
                速度 (m/s): <input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min="0" />
            </label>
            <label>
                方向 (度): <input type="number" value={direction} onChange={(e) => setDirection(Number(e.target.value))} min="0" max="360" />
            </label>
            <label>
                アニメーション速度: <input type="range" value={animationSpeed} onChange={handleAnimationSpeedChange} min="0.1" max="5" step="0.1" />
            </label>
            <button onClick={handleStart}>シミュレーション開始</button>
        </div>
    );
};

export default Controls;