<script lang="ts">
  import CreateDisk from "$lib/components/Disks/CreateDisk.svelte";
  import CreateRecord from "$lib/components/Records/CreateRecord.svelte";
  import RecordList from "$lib/components/Records/RecordList.svelte";
  import CreateTracker from "$lib/components/Trackers/CreateTracker.svelte";
  import { tabManager } from "$lib/utils/store.svelte";

  let insertFlag: "record" | "tracker" | "disk" = $state("record");
  let toggleInsert = $state(false);

  function switchCreation(flag: typeof insertFlag) {
    if (toggleInsert && insertFlag === flag) {
      toggleInsert = false;
      return;
    }
    toggleInsert = true;
    insertFlag = flag;
  }
</script>

<main>
  <div
    class="sticky top-0 left-0 my-2 flex items-center justify-center gap-8 border-b border-b-black bg-white py-2"
  >
    <button
      onclick={() => {
        toggleInsert = !toggleInsert;
      }}
      class="absolute left-5 cursor-pointer justify-start text-blue-500"
    >
      {!toggleInsert ? "➕ Show" : "➖ Hide"}
    </button>
    <button
      onclick={() => switchCreation("record")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Record</button
    >
    <button
      onclick={() => switchCreation("tracker")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Tracker</button
    >
    <button
      onclick={() => switchCreation("disk")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
    >
      Disk
    </button>
    <button
      class="absolute right-5 cursor-pointer rounded-sm bg-amber-400/80 px-2 py-1 font-semibold text-black uppercase"
      onclick={() => {
        tabManager.change();
      }}>things</button
    >
  </div>
  {#if toggleInsert}
    {#if insertFlag === "record"}
      <CreateRecord />
    {:else if insertFlag === "tracker"}
      <CreateTracker />
    {:else if insertFlag === "disk"}
      <CreateDisk />
    {/if}
    <hr class="w-full" />
  {/if}
  <RecordList />
</main>
