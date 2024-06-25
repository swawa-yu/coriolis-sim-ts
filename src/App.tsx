import React, { useState, useEffect, useRef } from 'react';
import Controls from './components/Controls';
import Animation1 from './components/Animation1';
import Animation2 from './components/Animation2';
import Animation3 from './components/Animation3';
import CoordinatesDisplay from './components/CoordinatesDisplay';
import { Position, PositionGeo } from './types';




export function calculatePosition(initialLatitude: number, initialLongitude: number, direction: number, time: number): Position {
    const theta = time;
    const latRad = initialLatitude * Math.PI / 180;
    const lonRad = initialLongitude * Math.PI / 180;
    const thetaRad = direction * Math.PI / 180;
    const R = 1;
    const x = R * (Math.cos(theta) * Math.cos(lonRad) * Math.cos(latRad) + Math.sin(theta) * (-Math.sin(lonRad) * Math.cos(thetaRad) - Math.cos(lonRad) * Math.sin(latRad) * Math.sin(thetaRad)));
    const y = R * (Math.cos(theta) * Math.sin(lonRad) * Math.cos(latRad) + Math.sin(theta) * (Math.cos(lonRad) * Math.cos(thetaRad) - Math.sin(lonRad) * Math.sin(latRad) * Math.sin(thetaRad)));
    const z = R * (Math.cos(theta) * Math.sin(latRad) + Math.sin(theta) * Math.cos(latRad) * Math.sin(thetaRad));
    return { x, y, z };
}



const App: React.FC = () => {
    const [initialLongitude, setInitialLongitude] = useState(135);
    const [initialLatitude, setInitialLatitude] = useState(0);
    const [speed, setSpeed] = useState(100);
    const [direction, setDirection] = useState(30);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [isRunning, setIsRunning] = useState(false);

    const globalTimeRef = useRef(0);
    const [earthRotation, setEarthRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

    const handleStartSimulation = (longitude: number, latitude: number, speed: number, direction: number, animationSpeed: number) => {
        setInitialLongitude(longitude);
        setInitialLatitude(latitude);
        setSpeed(speed);
        setDirection(direction);
        setAnimationSpeed(animationSpeed);
        setIsRunning(true);
    };

    const handleAnimationSpeedChange = (animationSpeed: number) => {
        setAnimationSpeed(animationSpeed);
    };

    useEffect(() => {
        let animationFrameId: number;
        const updateGlobalTime = () => {
            globalTimeRef.current += animationSpeed * 0.01;
            setPosition(calculatePosition(initialLatitude, initialLongitude, direction, globalTimeRef.current));
            setEarthRotation(globalTimeRef.current * 100); // 適当な係数をかけておく
            animationFrameId = requestAnimationFrame(updateGlobalTime);
        };

        if (isRunning) {
            updateGlobalTime();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRunning, initialLongitude, initialLatitude, direction, animationSpeed]);

    return (
        <div>
            <Controls
                onStartSimulation={handleStartSimulation}
                onAnimationSpeedChange={handleAnimationSpeedChange}
            />
            <CoordinatesDisplay
                position={position}
                earthRotation={earthRotation}
            />
            <div id="animations">
                <Animation1
                    initialPosition={{ x: 0, y: 0, z: 0 }}
                    globalTimeRef={globalTimeRef}
                    isRunning={isRunning}
                    position={position}
                    earthRotation={earthRotation}
                />
                <Animation2
                    initialPosition={{ x: 0, y: 0, z: 0 }}
                    globalTimeRef={globalTimeRef}
                    isRunning={isRunning}
                    position={position}
                    earthRotation={earthRotation}
                />
                <Animation3
                    initialLongitude={initialLongitude}
                    initialLatitude={initialLatitude}
                    globalTimeRef={globalTimeRef}
                    isRunning={isRunning}
                />
            </div>
        </div>
    );
};

export default App;