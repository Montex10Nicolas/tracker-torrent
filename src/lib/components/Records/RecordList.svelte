<script lang="ts">
  import { minutesToDateTuple, noInfiniteDecimals, stringDuration } from "$lib/utils/index.svelte";
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import { getRecords } from "./record.remote";
  import RecordItem from "./RecordItem.svelte";

  const fields = [
    "name",
    "size",
    "duration",
    "upTimeNeeded",
    "upTime",
    "isWatched",
    "isDeleted",
    "diskID",
    "trackerID",
    "completedAt",
  ] as const;
  type Fields = (typeof fields)[number];

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  let name = $state("");
  let sort: Fields = $state("name");
  let asc = $state(true);

  const dbRecords = $derived(await getRecords());
  let records = $derived(dbRecords);

  const filtered = $derived.by(() => {
    if (name === "") return records;
    return records.filter((record) => {
      if (record.name.toLowerCase().includes(name.toLowerCase())) return record;
    });
  });

  function changeSorting() {
    if (sort === null) return filtered;
    const sortedInput = sort as Exclude<Fields, null>;
    const desc = asc;
    return filtered.sort((first, second) => {
      const aValue = first[sortedInput];
      const bValue = second[sortedInput];
      if (aValue === null || bValue === null) {
        return 0;
      }
      if (desc) {
        return Number(aValue > bValue);
      } else {
        return Number(aValue < bValue);
      }
    });
  }

  const recordsLength = $derived(records.length);
  const recordSums = $derived(
    filtered.reduce(
      (prev, curr) => {
        const { size, duration, upTime, upTimeNeeded, isWatched, isDeleted } = curr;
        if (
          size === null ||
          duration === null ||
          upTime === null ||
          upTimeNeeded === null ||
          isWatched === null ||
          isDeleted === null
        ) {
          return prev;
        }
        return {
          size: prev.size + size,
          duration: prev.duration + duration,
          uptime: prev.uptime + upTime,
          uptimeNeeded: prev.uptimeNeeded + upTimeNeeded,
          watched: prev.watched + Number(isWatched),
          notWatched: prev.notWatched + Number(!isWatched),
          deleted: prev.deleted + Number(isDeleted),
          notDeleted: prev.notDeleted + Number(!isDeleted),
        };
      },
      {
        size: 0,
        duration: 0,
        uptime: 0,
        uptimeNeeded: 0,
        watched: 0,
        notWatched: 0,
        deleted: 0,
        notDeleted: 0,
      },
    ),
  );
</script>

<div class="min-w-screen">
  <div class="bg-sky-200 px-1 py-1">
    <label>
      <input type="text" class="rounded-xs" bind:value={name} placeholder="Name..." />
    </label>
    <label>
      Sort
      <select class="rounded-xs" bind:value={sort}>
        {#each fields as value}
          <option value={value}>{value}</option>
        {/each}
      </select>
    </label>
    <label>
      Asc
      <input type="checkbox" class="h-8 w-8 cursor-pointer rounded-xs" bind:checked={asc} />
    </label>
  </div>
  <table class="w-full">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Size</th>
        <th scope="col">Duration</th>
        <th scope="col">Deleted</th>
        <th scope="col">Watched</th>
        <th scope="col">Uptime</th>
        <th scope="col">Uptime <br /> Needed</th>
        <th scope="col">Completed At</th>
        <th scope="col">DiskID</th>
        <th scope="col">TrackerID</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody class="">
      {#each changeSorting() as record (`${sort}-${String(asc)}-${record.id}`)}
        <RecordItem record={record} disks={disks} trackers={trackers} />
      {:else}
        <tr>
          <td colspan="12" class="text-center font-bold"> There are no records here... </td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="w-full bg-gray-800 text-center text-white">
      <tr class="">
        <th class="py-2 pl-4 text-start">Total: {recordsLength}</th>
        <td>{noInfiniteDecimals(recordSums.size)}GB</td>
        <td class="">
          {noInfiniteDecimals(recordSums.duration)}m
          <br />
          {stringDuration(minutesToDateTuple(recordSums.duration))}
        </td>
        <td>{recordSums.deleted}<br />{recordSums.notDeleted}</td>
        <td>{recordSums.watched}<br />{recordSums.notWatched}</td>
        <td class="max-w-[4ch]">
          {recordSums.uptime}m
          <br />
          {stringDuration(minutesToDateTuple(recordSums.uptime))}
        </td>
        <td class="">
          <span>
            {noInfiniteDecimals(recordSums.uptimeNeeded)}m
          </span>
          <br />
          <span>
            {stringDuration(minutesToDateTuple(recordSums.uptimeNeeded))}
          </span>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</div>
