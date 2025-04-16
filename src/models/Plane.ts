export interface Plane {
    id: string;
    latitude: number;
    longitude: number;
    altitude: number;
    heading: number;
    speed: number;
    timestamp: string;
}

export function createDefaultPlane(id: string): Plane {
  return {
    id,
    latitude: 0,
    longitude: 0,
    altitude: 0,
    heading: 0,
    speed: 0,
    timestamp: new Date().toISOString()
  };
}
