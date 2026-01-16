<script lang="ts">
  import { getRecords } from "./record.remote";
  import RecordItem from "./RecordItem.svelte";

  const records = await getRecords();
</script>

<div>
  <h1>Records</h1>
  <ul>
    {#each records as record}
      <RecordItem record={record} />
    {/each}
  </ul>
</div>
