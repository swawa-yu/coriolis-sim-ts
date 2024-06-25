import React, { useEffect, useRef } from 'react';
import { Position } from '../types';
import * as THREE from 'three';

interface Animation2Props {
    initialPosition: Position;
    position: Position;
    earthRotation: number;
    isRunning: boolean;
    globalTimeRef: React.MutableRefObject<number>;
}

const Animation2: React.FC<Animation2Props> = ({ position, initialPosition, earthRotation, isRunning, globalTimeRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !isRunning) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
        const material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, opacity: 0.8 });
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        const ambientLight = new THREE.AmbientLight(0x404040, 3);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        const objectGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const object = new THREE.Mesh(objectGeometry, objectMaterial);
        scene.add(object);

        const initialPointGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const initialPointMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const initialPoint = new THREE.Mesh(initialPointGeometry, initialPointMaterial);
        scene.add(initialPoint);

        const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const trajectoryGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(3000);
        trajectoryGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        trajectoryGeometry.setDrawRange(0, 0);
        const trajectory = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
        scene.add(trajectory);

        camera.position.set(0, 0, 3);
        camera.lookAt(earth.position);


        initialPoint.position.set(initialPosition.x, initialPosition.y, initialPosition.z);

        const animate = () => {
            requestAnimationFrame(animate);

            const { x, y, z } = position;

            object.position.set(x, y, z);

            const drawCount = trajectory.geometry.drawRange.count;
            if (drawCount < 1000) {
                positions[drawCount * 3] = x;
                positions[drawCount * 3 + 1] = y;
                positions[drawCount * 3 + 2] = z;
                trajectory.geometry.setDrawRange(0, drawCount + 1);
            } else {
                positions.copyWithin(0, 3, positions.length);
                positions[positions.length - 3] = x;
                positions[positions.length - 2] = y;
                positions[positions.length - 1] = z;
                trajectory.geometry.setDrawRange(0, 1000);
            }
            trajectory.geometry.attributes.position.needsUpdate = true;


            renderer.render(scene, camera);
        };

        animate();

        return () => {
            container.removeChild(renderer.domElement);
        };
    }, [position, initialPosition, earthRotation, isRunning]);

    return <div id="animation2" ref={containerRef}></div>;
};

export default Animation2;