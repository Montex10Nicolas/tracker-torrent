<script lang="ts">
  const { children } = $props();
</script>

<svelte:head>
  <title>Tracker</title>
</svelte:head>

{@render children()}
