import { writable } from 'svelte/store';
import { createDefaultPlane, type Plane } from '../models/Plane';

const planeMap = new Map<string, Plane>();

const { subscribe, update, set } = writable<Map<string, Plane>>(planeMap);

export interface PlaneWithTrack extends Plane {
  track: [number, number][];
}

export function updatePlane(id: string, newData: Partial<Plane>) {
  update(currentMap => {
    const existing = currentMap.get(id) ?? createDefaultPlane(id);

    const updated = { ...existing, ...newData, id };
    currentMap.set(id, updated);

    return new Map(currentMap); // trigger reactivity
  });
}

export function setPlanes(planes: Plane[]) {
  const map = new Map<string, Plane>();
  planes.forEach(plane => map.set(plane.id, plane));
  set(map);
}

export const planeStore = {
  subscribe,
  updatePlane,
  setPlanes
};
