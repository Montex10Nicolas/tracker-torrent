<script lang="ts">
  import { page } from "$app/state";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { tabManager } from "$lib/utils/store.svelte";
  import Tab from "$lib/components/Tab/Tab.svelte";
  import Toast from "$lib/components/Toast/Toast.svelte";

  let { children } = $props();
</script>

<svelte:head
  ><link rel="icon" href={favicon} />
  <title>Track Me</title>
</svelte:head>

{#if tabManager.isOpen}
  <Tab />
{/if}

{@render children()}
<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>
      {locale}
    </a>
  {/each}
</div>

<Toast />
