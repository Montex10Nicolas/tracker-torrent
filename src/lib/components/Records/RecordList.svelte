<script lang="ts">
  import { minutesToDateTuple, noInfiniteDecimals, stringDuration } from "$lib/utils/index.svelte";
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import { getRecords } from "./record.remote";
  import RecordItem from "./RecordItem.svelte";

  type Fields =
    | null
    | "name"
    | "size"
    | "duration"
    | "upTimeNeeded"
    | "upTime"
    | "isWatched"
    | "isDeleted"
    | "diskID"
    | "trackerID"
    | "completedAt";

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  let sort: Fields = $state("name");
  let asc = $state(false);

  const dbRecords = $derived(await getRecords());
  let records = $derived(dbRecords);

  let sortedRecords = $state(() => changeSorting());

  function changeSorting() {
    if (sort === null) return dbRecords;
    const ss = sort as Exclude<Fields, null>;
    const desc = asc;
    return dbRecords.sort((a, b) => {
      const aValue = a[ss];
      const bValue = b[ss];
      if (aValue !== null && bValue !== null) {
        if (!desc) {
          return Number(aValue > bValue);
        } else {
          return Number(aValue < bValue);
        }
      } else {
        return 0;
      }
    });
  }

  const recordsLength = $derived(records.length);
  const recordSums = $derived(
    records.reduce(
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
  <div class="bg-sky-200">
    <label for="">
      Sort
      <select bind:value={sort}>
        {#each ["name", "size", "duration", "isDeleted", "isWatched", "upTime", "upTimeNeeded", "completedAt", "diskID", "trackerID"] as value}
          <option value={value}>{value}</option>
        {/each}
      </select>
    </label>
    <label for=""
      >Asc
      <input type="checkbox" bind:checked={asc} />
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
      {#each sortedRecords() as record (`${sort}-${String(asc)}-${record.id}`)}
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
