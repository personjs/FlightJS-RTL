import L from 'leaflet';

export function updateTrack(
  id: string,
  position: [number, number],
  map: L.Map,
  trails: Map<string, [number, number][]>,
  polylines: Map<string, L.Polyline>,
  maxLength: number = 50,
) {
  const trackLinesLayer = L.layerGroup();
  const trail = trails.get(id) ?? [];
  trail.push(position);
  if (trail.length > maxLength) trail.shift();
  trails.set(id, trail);

  const existing = polylines.get(id);
  if (existing) {
    existing.setLatLngs(trail);
  } else {
    const polyline = L.polyline(trail, {
      color: 'red',
      weight: 2,
    }).addTo(map);
    polylines.set(id, polyline);
  }
}

export function cleanupTracks(
  map: L.Map,
  trails: Map<string, [number, number][]>,
  polylines: Map<string, L.Polyline>,
  validIds: Set<string>
) {
  for (const [id, line] of polylines.entries()) {
    if (!validIds.has(id)) {
      map.removeLayer(line);
      polylines.delete(id);
      trails.delete(id);
    }
  }
}
