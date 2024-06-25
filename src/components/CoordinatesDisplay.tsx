import React from 'react';
import { xyzToGeo, absoluteToEarth } from '../utils'
import { Position } from '../types';

interface CoordinatesDisplayProps {
    position: Position
    earthRotation: number
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ position, earthRotation }) => {
    const positionGeo = xyzToGeo(position);
    const positionGeoEarth = absoluteToEarth(positionGeo, earthRotation);
    return (
        <div id="coordinates-display">
            <h3>現在の座標</h3>
            <p>絶対座標 (緯度, 経度): {positionGeo.lat.toFixed(2)}, {positionGeo.lon.toFixed(2)}</p>
            <p>地球上の座標 (緯度, 経度): {positionGeoEarth.lat.toFixed(2)}, {positionGeoEarth.lon.toFixed(2)}</p>
            <p>地球の回転角度: {earthRotation % 360}</p>
        </div>
    );
};

export default CoordinatesDisplay;