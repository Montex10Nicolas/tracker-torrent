<script lang="ts">
  import { addZeroDate, minutesToDateTuple } from "$lib/utils/index.svelte";
  import { tabManager } from "$lib/utils/store.svelte.js";
  import { onMount } from "svelte";
  import { recordById } from "./disk.remote";

  const { params } = $props();
  const response = $derived(await recordById(params.id));
  const { disk, records, trackers } = $derived({
    disk: response.disk[0],
    records: response.records,
    trackers: response.trackers,
  });

  let sums = $derived.by(() => {
    if (!records.length || !records) {
      return {
        sumSpace: 0,
      };
    }

    const allSums = records.reduce(
      (prev, curr) => {
        if (!curr || !curr.size) return prev;
        return {
          sumSpace: prev.sumSpace + curr.size,
        };
      },
      {
        sumSpace: 0,
      },
    );

    return allSums;
  });

  // DD-MM-YYYY
  function formaData(data: Date | null) {
    if (data === null) return "";
    const intl = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
    });
    return intl.format(data);
  }

  // Fom Minutes to dd-hh-mm
  function humanReadable(minute: number | null) {
    if (minute === null) {
      return `0d-0h-0m`;
    }
    const [days, hours, minutes] = minutesToDateTuple(minute);
    return `${addZeroDate(days)}d-${addZeroDate(hours)}h-${addZeroDate(minutes)}m`;
  }

  type SortOptions = "HR" | "tracker" | "watched" | "deleted";
  const sortArray = ["HR", "tracker", "watched", "deleted"] as const;
  type Order = "asc" | "desc";
  interface Sort {
    value: SortOptions;
    order: Order;
  }

  let sortOptions: Array<Sort> = $state([]);

  let displayTrackers = $derived.by(() => {
    return trackers;
  });
</script>

<svelte:head>
  <title>Disk {disk.name}</title>
</svelte:head>

<div
  class="relative flex items-center justify-between bg-sky-400 px-4 py-2 text-3xl font-extrabold"
>
  <h1>
    {disk.name} ({disk.space.toFixed(2)}GB)-({(disk.space - sums.sumSpace).toFixed(2)}GB left)
  </h1>
  <button
    class="cursor-pointer rounded-sm bg-yellow-300 px-2 py-1 font-semibold text-black uppercase"
    onclick={() => {
      tabManager.change();
    }}>Tab</button
  >
</div>
<main class="min-h-screen w-screen bg-gray-800 py-2">
  <section class="m-4 space-y-4">
    <div class="w-full rounded-md bg-white px-2 py-2">filters</div>
    <div class="w-full rounded-md bg-white px-2 py-2">
      <div>
        <div>
          <button
            onclick={() => {
              sortOptions.push({
                value: "HR",
                order: "asc",
              });
            }}
          >
            add
          </button>
          <div class="grid grid-cols-6 gap-x-12 gap-y-4">
            {#each sortOptions as options}
              <div class="flex gap-1">
                <select bind:value={options.value}>
                  {#each sortArray as option}
                    <option>
                      {option}
                    </option>
                  {/each}
                </select>
                <select bind:value={options.order}>
                  {#each ["asc", "desc"] as option}
                    <option>
                      {option}
                    </option>
                  {/each}
                </select>
              </div>
            {/each}
          </div>
        </div>
        <summary class="cursor-pointer">Order By</summary>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      {#each records as record (record.id)}
        {@const isHAR =
          record.upTimeNeeded !== null &&
          record.upTime !== null &&
          record.upTimeNeeded > record.upTime}
        <div class="rounded-md {isHAR ? 'bg-red-300' : 'bg-green-200'} grid grid-cols-12 px-4 py-2">
          <p class="col-span-8 font-black">{record.name}</p>
          <p class="col-span-4">{record.size?.toFixed(2)}GB</p>
          <p class="col-span-12 my-2">
            <span>Duration</span> <br />
            {humanReadable(record.duration)} ({record.duration}m)
          </p>
          <p class="col-span-6 capitalize">{record.isWatched ? "watched" : "not watched"}</p>
          <p class="col-span-6 capitalize">{record.isDeleted ? "deleted" : "not deleted"}</p>
          <p class="col-span-6 my-1">
            <span>Uptime</span>
            <br />
            {humanReadable(record.upTime)}
          </p>
          <p class="col-span-6 my-1">
            <span>Uptime Needed</span>
            <br />
            {humanReadable(record.upTimeNeeded)}
          </p>
          <p class="col-span-6 my-2"><span>Completed</span><br />{formaData(record.completedAt)}</p>
          <p class="col-span-6 my-2">
            <span>Latest Update</span><br />{formaData(record.updatedAt)}
          </p>
          <p class="col-span-12">
            {trackers.find((tracker) => {
              if (tracker.id === record.trackerID) return tracker;
            })?.name}
          </p>
        </div>
      {/each}
    </div>
  </section>
</main>
