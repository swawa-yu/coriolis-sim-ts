import React, { useEffect, useRef } from 'react';

interface Animation3Props {
    initialLongitude: number;
    initialLatitude: number;
    globalTimeRef: React.MutableRefObject<number>;
    isRunning: boolean;
}

const Animation3: React.FC<Animation3Props> = ({ initialLongitude, initialLatitude, globalTimeRef, isRunning }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !isRunning) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const mapImage = new Image();
        mapImage.src = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
        mapImage.onload = () => {
            const aspectRatio = mapImage.width / mapImage.height;

            const resizeCanvas = () => {
                const windowAspectRatio = window.innerWidth / window.innerHeight;
                let width, height;

                if (windowAspectRatio > aspectRatio) {
                    height = window.innerHeight;
                    width = height * aspectRatio;
                } else {
                    width = window.innerWidth;
                    height = width / aspectRatio;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawMap(ctx, mapImage, width, height, initialLongitude);
                drawGrid(ctx, width, height, initialLongitude);

                // 初期位置を描画
                const initialX = ((initialLongitude + 180) % 360) / 360 * width;
                const initialY = (1 - mercatorY(initialLatitude) / Math.PI) * height / 2;
                drawInitialPoint(ctx, initialX, initialY);
            };

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();  // 初回リサイズを実行

            return () => {
                window.removeEventListener('resize', resizeCanvas);
            };
        };

        let lastPosition: { x: number, y: number } | null = null;

        const drawMap = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, initialLongitude: number) => {
            const aspectRatio = image.width / image.height;
            const drawWidth = height * aspectRatio;

            // 初期経度に合わせて地図を描画（2回描画してトリミング）
            const offsetX = (initialLongitude + 180) / 360 * drawWidth;

            ctx.drawImage(image, -offsetX, 0, drawWidth, height);
            ctx.drawImage(image, -offsetX + drawWidth, 0, drawWidth, height);
        };

        const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, initialLongitude: number) => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;

            // 緯度線
            for (let lat = -75; lat <= 75; lat += 15) {
                const y = (1 - mercatorY(lat) / Math.PI) * height / 2;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // 経度線
            for (let lon = -180; lon <= 180; lon += 15) {
                const x = ((lon + 360 - initialLongitude) % 360) / 360 * width;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        };

        const mercatorY = (lat: number) => {
            return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 180 / 2));
        };

        const drawObject = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        };

        const drawInitialPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        };

        const drawTrajectory = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
            if (lastPosition) {
                ctx.beginPath();
                ctx.moveTo(lastPosition.x, lastPosition.y);
                ctx.lineTo(x, y);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            lastPosition = { x, y };
        };

        const calculateOrbitPosition = (lat: number, lon: number, theta: number, t: number) => {
            const R = 1;
            const latRad = lat * Math.PI / 180;
            const lonRad = lon * Math.PI / 180;
            const thetaRad = theta * Math.PI / 180;

            const x = R * (Math.cos(t) * Math.cos(lonRad) * Math.cos(latRad) + Math.sin(t) * (-Math.sin(lonRad) * Math.cos(thetaRad) - Math.cos(lonRad) * Math.sin(latRad) * Math.sin(thetaRad)));
            const y = R * (Math.cos(t) * Math.sin(lonRad) * Math.cos(latRad) + Math.sin(t) * (Math.cos(lonRad) * Math.cos(thetaRad) - Math.sin(lonRad) * Math.sin(latRad) * Math.sin(thetaRad)));
            const z = R * (Math.cos(t) * Math.sin(latRad) + Math.sin(t) * Math.cos(latRad) * Math.sin(thetaRad));

            const posLat = Math.asin(z / R) * 180 / Math.PI;
            const posLon = Math.atan2(y, x) * 180 / Math.PI;
            return { lat: posLat, lon: posLon, x, y, z };
        };

        const animate = () => {
            if (!isRunning) return;
            requestAnimationFrame(animate);

            const pos = calculateOrbitPosition(initialLatitude, initialLongitude, 30, globalTimeRef.current); // 30 is a placeholder for theta
            const aspectRatio = mapImage.width / mapImage.height;
            const windowAspectRatio = window.innerWidth / window.innerHeight;
            let width, height;

            if (windowAspectRatio > aspectRatio) {
                height = window.innerHeight;
                width = height * aspectRatio;
            } else {
                width = window.innerWidth;
                height = width / aspectRatio;
            }

            const x = ((pos.lon + 180) % 360) / 360 * width;
            const y = (1 - mercatorY(pos.lat) / Math.PI) * height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMap(ctx, mapImage, width, height, initialLongitude);
            drawGrid(ctx, width, height, initialLongitude);
            drawTrajectory(ctx, x, y);
            drawObject(ctx, x, y);
        };

        animate();

    }, [initialLongitude, initialLatitude, globalTimeRef, isRunning]);

    return <canvas id="animation3" ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>;
};

export default Animation3;