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

  const freezedRecord = $derived(Object.freeze(record));

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

  const hasSomethingChanged = $derived.by(() => {
    if (id !== freezedRecord.id) return true;
    if (isDeleted !== freezedRecord.isDeleted) return true;
    if (name !== freezedRecord.name) return true;
    if (size !== freezedRecord.size) return true;
    if (duration !== freezedRecord.duration) return true;
    if (isWatched !== freezedRecord.isWatched) return true;
    if (upTime !== freezedRecord.upTime) return true;
    if (completedAt !== freezedRecord.completedAt) return true;
    if (diskID !== freezedRecord.diskID) return true;
    if (trackerID !== freezedRecord.trackerID) return true;
    return false;
  });

  let durationFlag = $state(false);
  // Show if the confirm delete is showing
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
    const [key, _, delay] = globalToats.add(
      {
        message: `Updating ${name}`,
        type: "UPDATE",
      },
      2000,
    );
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
    }).then(({ success }) => {
      setTimeout(() => {
        const message = `${success ? "" : "Not"} Updated ${name}`;
        globalToats.update(key, {
          message,
          type: "UPDATE",
        });
      }, delay);
    });
  }
  async function handleDelete() {
    const [key, _, delay] = globalToats.add({
      message: `Deleted ${name}`,
      type: "DELETE",
    });
    await deleteRecord(id).then((res) => {
      globalToats.update(
        key,
        {
          message: `${res.result ? "Successfully" : "Unsuccesfully"} deleted`,
          type: "DELETE",
        },
        delay,
      );
    });
    deleteFlag = false;
  }
</script>

{#if deleteFlag}
  <div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-sky-100/80">
    <div class="rounded-md border border-black bg-white px-8 py-6">
      <p>Do you want to delete <span class="text-lg font-extrabold">{name}</span>?</p>
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
  <!-- Name -->
  <td class="w-[15ch]">
    <input type="text" class="" bind:value={name} />
  </td>
  <!-- Size -->
  <td class="flex w-[8ch] justify-center">
    <input class="w-full" type="number" bind:value={size} step="any" />
  </td>
  <!-- Duration -->
  <td class="w-[20ch]">
    <div class="flex justify-center gap-1">
      {#if durationFlag}
        <input type="number" class="w-[60%]" bind:value={duration} />
        <button
          class="cursor-pointer rounded-sm bg-green-600 px-2 font-semibold"
          onclick={() => {
            durationFlag = false;
          }}>Close</button
        >
      {:else}
        <button
          class="cursor-pointer"
          onclick={() => {
            durationFlag = !durationFlag;
          }}
        >
          {stringDuration(totalRuntime)}
        </button>
      {/if}
    </div>
  </td>
  <td
    class="cursor-pointer flex-col px-1 text-center"
    onclick={() => {
      isDeleted = !isDeleted;
    }}
  >
    {isDeleted ? " " : "Not"}
    <br />
    Deleted
  </td>
  <td
    class="cursor-pointer px-1 text-center"
    onclick={() => {
      isWatched = !isWatched;
    }}
  >
    {isWatched ? " " : "Not"}
    <br />
    Watched
  </td>
  <td class="flex max-w-[10ch] flex-col items-center justify-center text-center">
    <input class="w-[90%]" type="number" bind:value={upTime} />
    <small class="">
      {stringDuration(minutesToDateTuple(upTime ?? 0))}
    </small>
  </td>
  <td class="max-w-[10ch]">
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
  <td class="max-w-[22ch]">
    {#if completedAt !== null}
      <input
        type="datetime-local"
        class=""
        bind:value={
          () => local_time(completedAt!),
          (v) => {
            completedAt = new Date(v);
          }
        }
      />
    {/if}
  </td>
  <td class="max-w-[14ch]">
    <select bind:value={diskID} class="">
      {#each disks as disk}
        <option value={disk.id}>{disk.name} ({disk.space})</option>
      {/each}
    </select>
  </td>
  <td class="max-w-[12ch]">
    <select bind:value={trackerID} class="">
      {#each trackers as tracker}
        <option value={tracker.id}>{tracker.name}</option>
      {/each}
    </select>
  </td>
  <td class="grid grid-cols-2 gap-1 px-1"
    ><button
      disabled={!hasSomethingChanged}
      onclick={handleUpdate}
      class="cursor-pointer rounded-sm bg-amber-400 font-semibold disabled:bg-gray-700 disabled:text-white"
      >UP</button
    >
    <button
      style="anchor-name: --my-anchor;"
      onclick={() => (deleteFlag = true)}
      class="cursor-pointer rounded-sm bg-red-600 font-semibold text-white">DEL</button
    >
    <button
      class="col-span-2 cursor-pointer rounded-sm bg-sky-300 font-semibold disabled:bg-gray-700 disabled:text-white"
      disabled={!hasSomethingChanged}
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
  }

  select {
    border-color: transparent;
  }
</style>
