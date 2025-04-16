<script lang="ts">
  export let onToggleSettings: (() => void) | undefined;
</script>

<div class="toolbar">
  <button class="toolbar-btn" on:click={() => onToggleSettings?.()}>
    ⚙️ Settings
  </button>
</div>

<style>
  .toolbar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    background: var(--bg-card);
    padding: 0.75rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    backdrop-filter: blur(10px);
  }

  .toolbar-btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    background: linear-gradient(to right, #6366f1, #3b82f6);
    color: white;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.2s;
  }

  .toolbar-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
</style>
