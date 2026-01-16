<script lang="ts">
  import type { RecordInsert } from "$lib/server/db/schema";

  let record: RecordInsert = $state({
    id: crypto.randomUUID(),
    name: null,
    size: null,
    duration: null,
    isWatched: null,
    isDeleted: null,
    upTime: null,
    completedAt: null,
    diskID: null,
    updatedAt: null,
    trackerID: null,
  });
  const uptimeNeeded = $derived.by(() => {
    const { size } = record;
    let hours = 0;
    if (size === null || size === undefined) {
      return null;
    }
    if (size <= 1) {
      hours = 72;
    }
    if (size > 1 && size < 50) {
      hours = 72 + 2 * size;
    }
    if (size >= 50) {
      hours = 100 * Math.log(size) - 219.2023;
    }
    return hours * 60;
  });
</script>

<pre><code>{JSON.stringify(record, null, 2)}</code></pre>
<div class="flex flex-wrap items-center gap-x-8 gap-y-2">
  <label>
    Name
    <input type="text" bind:value={record.name} />
  </label>
  <label for="">
    Size
    <input type="number" bind:value={record.size} />
  </label>
  <label for="">
    Duration
    <input type="number" bind:value={record.duration} />
  </label>
  <label for=""
    >Watched
    <input type="checkbox" bind:checked={record.isWatched} />
  </label>
  <label for=""
    >Deleted
    <input type="checkbox" bind:checked={record.isDeleted} />
  </label>
  <label for=""
    >Uptime
    <input type="number" bind:value={record.upTime} />
  </label>
  <label for=""
    >Uptime needed
    <input type="number" bind:value={() => uptimeNeeded, () => {}} />
  </label>
  <label for=""
    >Completed At
    <input type="date" bind:value={record.completedAt} />
  </label>
  <label for="">
    Disk
    <select name="" id=""> </select>
  </label>
  <label for="">
    Tracker
    <select name="" id=""> </select>
  </label>
  <button
    class="cursor-pointer rounded-sm border-2 border-sky-950 bg-blue-500 px-8 py-2 font-semibold text-white uppercase shadow"
    >Create</button
  >
</div>

<style>
  label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  input,
  select,
  option {
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
