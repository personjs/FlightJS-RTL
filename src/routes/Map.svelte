<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import L from "leaflet";
  import { planeStore } from "../stores/planeStore";
  import { closePlaneSocket, initPlaneSocket } from "../services/planeSocket";
  import { cleanupMarkers, updateMarker } from "../lib/map/markers";
  import { cleanupTracks, updateTrack } from "../lib/map/tracks";
  import { isValidLatLon } from "../lib/map/utils";
  import MapToolbar from "../components/MapToolbar.svelte";
  import SettingsPanel from "../components/SettingsPanel.svelte";

  // Leaflet
  let map: L.Map;
  let markers: Map<string, L.Marker> = new Map();
  let tracks: Map<string, L.Polyline> = new Map();
  let trails: Map<string, [number, number][]> = new Map();
  let trackLinesLayer: L.LayerGroup;

  // Settings
  let showSettings = false;
  let tileLayer: L.TileLayer;
  let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let showTrackLines = true;

  // Watch plane store for updates
  $: {
    if (map) {
      const planes = Array.from($planeStore.values());
      const activeIds = new Set<string>();

      for (const plane of planes) {
        const { id, latitude, longitude } = plane;

        if (!isValidLatLon(latitude, longitude)) continue;

        const position: [number, number] = [latitude, longitude];
        activeIds.add(id);

        updateMarker(id, position, map, markers);
        updateTrack(id, position, map, trails, tracks);
      }

      cleanupMarkers(map, markers, activeIds);
      cleanupTracks(map, trails, tracks, activeIds);
    }
  }

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function handleTileChange(newTile: string) {
    tileUrl = newTile;
    tileLayer.setUrl(tileUrl);
  }

  function toggleTrackLines(show: boolean) {
    showTrackLines = show;
    if (showTrackLines) {
      trackLinesLayer.addTo(map);
    } else {
      trackLinesLayer.removeFrom(map);
    }
  }

  onMount(() => {
    initPlaneSocket("ws://11.32.32.198/ws");

    map = L.map("map", { zoomControl: false }).setView([51.505, -0.09], 13);

    tileLayer = L.tileLayer(tileUrl, {
      attribution: "",
    }).addTo(map);

    trackLinesLayer = L.layerGroup();

    setUserPositionView();
  });

  onDestroy(() => {
    closePlaneSocket();
  });

  function setUserPositionView() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 8);
      });
    }
  }
</script>

<div class="map-wrapper">
  <div id="map"></div>

  <MapToolbar onToggleSettings={toggleSettings} />
  <SettingsPanel
    visible={showSettings}
    selectedTile={tileUrl}
    onTileChange={handleTileChange}
    showTrackLines={showTrackLines}
    onToggleTrackLines={toggleTrackLines} />
</div>

<style>
  .map-wrapper {
    position: relative;
    height: 100vh;
  }

  #map {
    height: 100%;
  }
</style>
