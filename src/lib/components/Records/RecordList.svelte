<script lang="ts">
  import { minutesToDateTuple, noInfiniteDecimals, stringDuration } from "$lib/utils/index.svelte";
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import { getRecords } from "./record.remote";
  import RecordItem from "./RecordItem.svelte";

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  const records = $derived(await getRecords());
  const recordSums = $derived(
    records.reduce(
      (prev, curr) => {
        const { size, duration, upTime, upTimeNeeded } = curr;
        if (size === null || duration === null || upTime === null || upTimeNeeded === null) {
          return prev;
        }
        return {
          size: prev.size + size,
          duration: prev.duration + duration,
          uptime: prev.uptime + upTime,
          uptimeNeeded: prev.uptimeNeeded + upTimeNeeded,
        };
      },
      {
        size: 0,
        duration: 0,
        uptime: 0,
        uptimeNeeded: 0,
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
        <td>{noInfiniteDecimals(recordSums.size)}</td>
        <td class="flex flex-col">
          <span>
            {noInfiniteDecimals(recordSums.duration)}
          </span>
          <span>
            <small>
              {stringDuration(minutesToDateTuple(recordSums.duration))}
            </small>
          </span>
        </td>
        <td></td>
        <td></td>
        <td class="max-w-[4ch] text-xs">
          <span>
            {recordSums.uptime}
          </span>
          <span>
            {stringDuration(minutesToDateTuple(recordSums.uptime))}
          </span>
        </td>
        <td class="flex flex-col">
          <span>
            {noInfiniteDecimals(recordSums.uptimeNeeded)}
          </span>
          <span>
            <small>
              {stringDuration(minutesToDateTuple(recordSums.uptimeNeeded))}
            </small>
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
