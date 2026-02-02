<script lang="ts">
  import { minutesToDateTuple, noInfiniteDecimals, stringDuration } from "$lib/utils/index.svelte";
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import { getRecords } from "./record.remote";
  import RecordItem from "./RecordItem.svelte";

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  const records = $derived(await getRecords());
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
      {#each records as record}
        <RecordItem record={record} disks={disks} trackers={trackers} />
      {:else}
        <tr>
          <td colspan="12" class="text-center font-bold"> There are no records here... </td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="w-full bg-gray-800 text-center text-white">
      <tr class="">
        <th class="py-2 pl-4 text-start">Total:</th>
        <td>{noInfiniteDecimals(recordSums.size)}GB</td>
        <td class="">
          {noInfiniteDecimals(recordSums.duration)}m
          <br />
          {stringDuration(minutesToDateTuple(recordSums.duration))}
        </td>
        <td>{recordSums.deleted}/{recordsLength} <br />{recordSums.notDeleted}/{recordsLength}</td>
        <td>{recordSums.watched}/{recordsLength} <br />{recordSums.notWatched}/{recordsLength}</td>
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
