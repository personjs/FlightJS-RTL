<script lang="ts">
  import { slide } from "svelte/transition";
  export let visible = false;
  export let selectedTile = "";
  export let onTileChange: ((tileUrl: string) => void) | undefined;
  export let showTrackLines = true;
  export let onToggleTrackLines: ((show: boolean) => void) | undefined;

  const tileOptions = [
    {
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "CartoDB Light",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    },
    {
      name: "CartoDB Light (No Labels)",
      url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    },
    {
      name: "CartoDB Dark",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    },
    {
      name: "CartoDB Dark (No Labels)",
      url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    },
    {
      name: "Esri Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    {
      name: "OpenTopoMap",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
  ];

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    onTileChange?.(value);
  }

  function toggleTrackLines(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    onToggleTrackLines?.(checked);
  }
</script>

{#if visible}
  <div class="panel" transition:slide={{ duration: 300 }}>
    <h3>⚙️ Settings</h3>
    <hr />

    <label for="tiles">🧱 Tile Server</label>
    <select id="tiles" on:change={handleChange} bind:value={selectedTile}>
      {#each tileOptions as tile}
        <option value={tile.url}>{tile.name}</option>
      {/each}
    </select>

    <div class="checkbox-wrapper">
      <label for="showTrackLines">
        <input type="checkbox" id="showTrackLines" checked={showTrackLines} on:change={toggleTrackLines} />
        Show Track Lines
      </label>
    </div>
  </div>
{/if}

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
</svelte:head>

<style>
  .panel {
    position: absolute;
    top: 5rem;
    right: 1rem;
    z-index: 1000;
    background: var(--bg-panel);
    color: var(--text-primary);
    padding: 1.25rem;
    width: 260px;
    border-radius: 1rem;
    box-shadow: 0 8px 20px var(--shadow);
    font-family: "Inter", sans-serif;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0;
  }

  hr {
    margin-top: 0.5rem;
    border: none;
    border-top: 1px solid rgba(120, 120, 120, 0.3);
  }

  label {
    margin-top: 1rem;
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
  }

  select, input[type="checkbox"] {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(120, 120, 120, 0.3);
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .checkbox-wrapper {
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
</style>
