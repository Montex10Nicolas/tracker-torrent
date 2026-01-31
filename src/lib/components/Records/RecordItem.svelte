<script lang="ts">
  import { type DiskSelect, type RecordSelect, type TrackerSelect } from "$lib/server/db/schema";
  import {
    addZeroDate,
    minutesToDateTuple,
    stringDuration,
    uptimeNeeded,
  } from "$lib/utils/index.svelte";
  import { globalToats } from "../Toast/toast.svelte";
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

    return minutesToDateTuple(duration);
  });

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
    const [key, toast] = globalToats.add({
      message: `Updating ${name}`,
      type: "UPDATE",
    });
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
    }).then((res) => {
      setTimeout(() => {
        const message = (res ? "" : "Not") + " Updated " + name;
        globalToats.update(key, {
          message,
          type: "UPDATE",
        });
      }, 1000);
    });
  }
  async function handleDelete() {
    await deleteRecord(id);
    deleteFlag = false;

    globalToats.add({
      message: `Delted ${name}`,
      type: "DELETE",
    });
  }
</script>

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

<tr class="">
  <td class="hidden"> {id}</td>
  <td class="max-w-[20ch] overflow-hidden focus-within:min-w-fit">
    <input type="text" class="" bind:value={name} />
  </td>
  <td class="max-w-[6ch]">
    <input class="max-w-full" type="number" bind:value={size} step="0.01" />
  </td>
  <!-- Duration -->
  <td class="max-w-[10ch]">
    {#if durationFlag}
      <div class="flex flex-col">
        <input type="number" class="max-w-20" bind:value={duration} />
        <button
          class="mx-auto mb-1 w-full cursor-pointer rounded-sm bg-green-400 px-1 text-sm font-semibold text-black uppercase"
          onclick={() => {
            durationFlag = false;
          }}>Close</button
        >
      </div>
    {:else}
      <button
        class="flex w-full items-center justify-center px-1.5"
        onclick={() => {
          durationFlag = !durationFlag;
        }}
      >
        {stringDuration(totalRuntime)}
      </button>
    {/if}
  </td>
  <td
    class="flex cursor-pointer flex-col px-1.5 text-center text-sm"
    onclick={() => {
      isDeleted = !isDeleted;
    }}
  >
    <span>
      {isDeleted ? " " : "Not"}
    </span>
    Deleted
  </td>
  <td
    class="cursor-pointer text-center"
    onclick={() => {
      isWatched = !isWatched;
    }}
  >
    <span>
      {isWatched ? " " : "Not"}
    </span>
    Watched
  </td>
  <td class="">
    <input class="" type="number" bind:value={upTime} />
    <small class="">
      {stringDuration(minutesToDateTuple(upTime ?? 0))}
    </small>
  </td>
  <td class="">
    <span class="flex flex-col text-center">
      {#if upTimeNeeded === null}
        <span class="font-semibold">
          {uptimeNeeded(size ?? 0)}
        </span>
        <small>{stringDuration(minutesToDateTuple(size ?? 0))}</small>
      {:else}
        <span class="mx-auto font-semibold">
          {upTimeNeeded}
        </span>
        <small>
          {stringDuration(minutesToDateTuple(upTimeNeeded))}
        </small>
      {/if}
    </span>
  </td>
  <td class="max-w-[19ch] text-center">
    {#if completedAt !== null}
      <input
        type="datetime-local"
        class="text-sm"
        bind:value={
          () => local_time(completedAt!),
          (v) => {
            completedAt = new Date(v);
          }
        }
      />
    {/if}
  </td>
  <td class="max-w-[11ch]">
    <select bind:value={diskID} class="text-xs">
      {#each disks as disk}
        <option value={disk.id}>{disk.name} ({disk.space})</option>
      {/each}
    </select>
  </td>
  <td class="max-w-[11ch]">
    <select bind:value={trackerID} class="text-xs">
      {#each trackers as tracker}
        <option value={tracker.id}>{tracker.name}</option>
      {/each}
    </select>
  </td>
  <td class="grid grid-cols-2 grid-rows-2"
    ><button
      onclick={handleUpdate}
      class="w-full cursor-pointer bg-sky-400 px-2 text-xs font-semibold text-white uppercase"
      >UP</button
    >
    <button
      style="anchor-name: --my-anchor;"
      onclick={() => (deleteFlag = true)}
      class="w-full cursor-pointer bg-red-800 px-2 py-1 text-xs font-semibold text-white uppercase"
      >DEL</button
    >
    <button
      class="col-span-2 row-span-1 cursor-pointer px-2 py-1 text-xs font-semibold uppercase"
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
  input[type="number"] {
    text-align: right;
  }

  /* tr { */
  /*   border: 1px solid gray; */
  /*   padding: 0px 2px; */
  /* } */

  td {
    border-left: 1px solid gray;
  }

  select {
    border-color: transparent;
  }
</style>
