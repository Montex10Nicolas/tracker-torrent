<script lang="ts">
  import CreateDisk from "$lib/components/Disks/CreateDisk.svelte";
  import CreateRecord from "$lib/components/Records/CreateRecord.svelte";
  import RecordList from "$lib/components/Records/RecordList.svelte";
  import CreateTracker from "$lib/components/Trackers/CreateTracker.svelte";

  let insertFlag: "record" | "tracker" | "disk" = $state("record");
  let toggleInsert = $state(false);

  function handleButtons(flag: typeof insertFlag) {
    toggleInsert = true;
    insertFlag = flag;
  }
</script>

<main>
  <div class="relative mt-2 flex items-center justify-center gap-8">
    <button
      onclick={() => {
        toggleInsert = !toggleInsert;
      }}
      class="absolute left-5 cursor-pointer justify-start text-blue-500"
    >
      {toggleInsert ? "- Hide" : "+ Show"}
    </button>
    <button
      onclick={() => handleButtons("record")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Record</button
    >
    <button
      onclick={() => handleButtons("tracker")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Tracker</button
    >
    <button
      onclick={() => handleButtons("disk")}
      class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white uppercase"
    >
      Disk
    </button>
  </div>
  {#if toggleInsert}
    {#if insertFlag === "record"}
      <CreateRecord />
    {:else if insertFlag === "tracker"}
      <CreateTracker />
    {:else if insertFlag === "disk"}
      <CreateDisk />
    {/if}
  {/if}
  <RecordList />
</main>
