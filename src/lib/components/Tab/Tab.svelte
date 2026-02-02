<script>
  import { resolve } from "$app/paths";
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import { tabManager } from "$lib/utils/store.svelte";

  const trackers = $derived(await getAllTrackers());
  const disks = $derived(await getAllDisks());
</script>

<div
  class="absolute top-0 right-0 z-99 min-h-screen w-80 rounded-l-xl border-l border-black bg-blue-800 font-semibold text-white"
>
  <div class="flex w-full justify-end px-4 py-2">
    <button
      class="cursor-pointer rounded-sm bg-gray-700/80 px-2 py-1 font-semibold text-white uppercase"
      onclick={() => {
        tabManager.change();
      }}>Close</button
    >
  </div>
  <div class="flex flex-col gap-4 px-4">
    <a onclick={() => tabManager.change()} href={resolve("/")}>Home</a>
    <details>
      <ul>
        {#each trackers as tracker}
          {#if tracker.name !== "NULL"}
            <li>
              <a
                onclick={() => tabManager.change()}
                href={resolve("/trackers/[id]", { id: tracker.id })}
              >
                {tracker.name}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
      <summary class="cursor-pointer"> Trackers </summary>
    </details>

    <details>
      <ul>
        {#each disks as disk}
          <li>
            <a onclick={() => tabManager.change()} href={resolve("/disks/[id]", { id: disk.id })}>
              {disk.name}
            </a>
          </li>
        {/each}
      </ul>
      <summary class="cursor-pointer"> Disks </summary>
    </details>
  </div>
</div>

<style>
  a:hover {
    color: black;
  }
</style>
