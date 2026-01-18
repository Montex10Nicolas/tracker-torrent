<script lang="ts">
  import { type DiskSelect, type RecordSelect, type TrackerSelect } from "$lib/server/db/schema";
  import { addZeroDate, uptimeNeeded } from "$lib/utils/index.svelte";
  import { deleteRecord, updateRecord } from "./record.remote";

  type Props = {
    record: RecordSelect;
    disks: DiskSelect[];
    trackers: TrackerSelect[];
  };
  const { record = $bindable(), disks, trackers }: Props = $props();

  const freezedRecord = Object.freeze(record);

  let {
    id,
    name,
    size,
    duration,
    isDeleted,
    isWatched,
    upTime,
    upTimeNeeded,
    completedAt,
    updatedAt,
    diskID,
    trackerID,
  } = $derived(record);

  let durationFlag = $state(false);
  let deleteFlag = $state(false);

  const totalRuntime = $derived.by(() => {
    if (duration === null) return null;
    let tempDuration = duration;
    const days = Math.floor(tempDuration / (60 * 24));
    tempDuration -= days * (60 * 24);
    const hours = Math.floor(tempDuration / 60);
    const minutes = tempDuration - hours * 60;

    return [days, hours, minutes] as const;
  });
  const stringDuration = () =>
    totalRuntime === null ? "" : `${totalRuntime[0]}d-${totalRuntime[1]}h-${totalRuntime[2]}m`;

  const shortDate = (date: Date | null) => {
    if (date === null) return "";
    return new Intl.DateTimeFormat("it", {
      dateStyle: "short",
    }).format(date);
  };
  const local_time = (today: Date) =>
    `${today.getFullYear()}-${addZeroDate(today.getMonth() + 1)}-${addZeroDate(
      today.getDate(),
    )}T${addZeroDate(today.getHours())}:${addZeroDate(today.getMinutes())}`;

  async function handleUpdate() {
    await updateRecord({
      id,
      name,
      size,
      duration,
      isDeleted,
      isWatched,
      upTime,
      upTimeNeeded,
      completedAt: completedAt === null ? null : local_time(completedAt),
      updatedAt: Number(new Date()),
      diskID,
      trackerID,
    });
  }
  async function handleDelete() {
    const res = await deleteRecord(id);
    deleteFlag = false;
  }
</script>

<svelte:window />

{#if deleteFlag}
  <div
    class="absolute top-0 left-0 z-99 grid h-screen w-screen place-items-center overflow-hidden bg-gray-800/80"
  >
    <div class="rounded-xl bg-white p-8">
      <p>Do you want to delete <span class="font-bold">{name}</span>?</p>
      <div class="flex justify-around">
        <button
          class="cursor-pointer rounded-sm bg-green-700 p-2 font-semibold text-white uppercase"
          onclick={() => (deleteFlag = false)}>No</button
        >
        <button
          class="cursor-pointer rounded-sm bg-red-900 p-2 font-semibold text-white uppercase"
          onclick={handleDelete}>Yes</button
        >
      </div>
    </div>
  </div>
{/if}

<tr class="relative rounded-sm border border-transparent">
  <td class="hidden"> {id}</td>
  <td class="">
    <input type="text" class="" bind:value={name} />
  </td>
  <td class="max-w-20">
    <input class="max-w-full" type="number" bind:value={size} step="0.01" />
  </td>
  <td>
    {#if durationFlag}
      <div class="flex flex-col">
        <input type="number" class="max-w-20" bind:value={duration} />
        <button
          class="mx-auto mb-1 cursor-pointer rounded-sm bg-green-400 px-1 text-sm text-black uppercase"
          onclick={() => {
            durationFlag = false;
          }}>Close</button
        >
      </div>
    {:else}
      <button
        class="cursor-pointer"
        onclick={() => {
          durationFlag = !durationFlag;
        }}
      >
        {stringDuration()}
      </button>
    {/if}
  </td>
  <td
    class="cursor-pointer"
    onclick={() => {
      isDeleted = !isDeleted;
    }}>{isDeleted ? "Deleted" : "Not Deleted"}</td
  >
  <td
    class="cursor-pointer"
    onclick={() => {
      isWatched = !isWatched;
    }}>{isWatched ? "" : "Not"} Watched</td
  >
  <td class="max-w-20"> <input class="max-w-full" type="number" bind:value={upTime} /></td>
  <td class="text-center align-middle">{size !== null ? uptimeNeeded(size) : upTimeNeeded}</td>
  <td>
    {#if completedAt !== null}
      <input
        type="datetime-local"
        bind:value={
          () => local_time(completedAt!),
          (v) => {
            completedAt = new Date(v);
          }
        }
      />
    {/if}
  </td>
  <td>
    <select>
      {#each disks as disk}
        <option value={disk.id}>{disk.name}</option>
      {/each}
    </select>
  </td>
  <td>
    <select>
      {#each trackers as tracker}
        <option value={tracker.id}>{tracker.name}</option>
      {/each}
    </select>
  </td>
  <td class="grid grid-cols-2 grid-rows-2 flex-col"
    ><button
      onclick={handleUpdate}
      class="w-full cursor-pointer bg-sky-400 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Update</button
    >
    <button
      onclick={() => (deleteFlag = true)}
      class="w-full cursor-pointer bg-red-800 px-2 py-1 text-sm font-semibold text-white uppercase"
      >Delete</button
    >
    <button
      class="col-span-2 row-span-1 cursor-pointer px-2 py-1 text-sm font-semibold uppercase"
      onclick={() => {
        name = freezedRecord.name;
        size = freezedRecord.size;
        duration = freezedRecord.duration;
        isWatched = freezedRecord.isWatched;
        isDeleted = freezedRecord.isDeleted;
        upTime = freezedRecord.upTime;
        completedAt = freezedRecord.completedAt;
        diskID = freezedRecord.diskID;
        trackerID = freezedRecord.trackerID;
      }}>Reset</button
    >
  </td>
</tr>

<style>
  input {
    border-color: transparent;
    appearance: textfield;
    -moz-appearance: textfield;
  }
  input[type="datetime-local"] {
    width: 210px;
    padding: 0 auto;
  }
  input[type="text"] {
    text-align: left;
  }
  input[type="number"] {
    text-align: right;
  }
  input:hover {
    border: 1px solid black;
  }
  td {
    text-align: center;
    border: 1px solid gray;
  }
  select {
    border: none;
  }
</style>
