import L from 'leaflet';

export function updateMarker(
  id: string,
  position: L.LatLngExpression,
  map: L.Map,
  markers: Map<string, L.Marker>
) {
  const existing = markers.get(id);
  const tooltip = `
      ✈️ <b>${id}</b> (${position.toString()})
    `;
  if (existing) {
    existing.setLatLng(position);
    existing.bindPopup(tooltip);
  } else {
    const marker = L.marker(position).addTo(map).bindPopup(tooltip);
    markers.set(id, marker);
  }
}

export function cleanupMarkers(
  map: L.Map,
  markers: Map<string, L.Marker>,
  validIds: Set<string>
) {
  for (const [id, marker] of markers.entries()) {
    if (!validIds.has(id)) {
      map.removeLayer(marker);
      markers.delete(id);
    }
  }
}
