import { Position, PositionGeo } from "./types";

export function geoToXyz(positionGeo: PositionGeo): Position {
    const latRad = positionGeo.lat * Math.PI / 180;
    const lonRad = positionGeo.lon * Math.PI / 180;
    const x = Math.cos(latRad) * Math.cos(lonRad);
    const y = Math.cos(latRad) * Math.sin(lonRad);
    const z = Math.sin(latRad);
    return { x, y, z };
}

export function xyzToGeo(position: Position): PositionGeo {
    const lat = Math.asin(position.z) * 180 / Math.PI;
    const lon = Math.atan2(position.y, position.x) * 180 / Math.PI;
    return { lat, lon };
}

export function degreeToRadian(degree: number): number {
    return degree * Math.PI / 180;
}

export function radianToDegree(radian: number): number {
    return radian * 180 / Math.PI;
}

export function absoluteToEarth(positionGeo: PositionGeo, earthRotation: number): PositionGeo {
    return { lat: positionGeo.lat, lon: positionGeo.lon - earthRotation };
}