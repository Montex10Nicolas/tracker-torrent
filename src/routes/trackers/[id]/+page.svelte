<script lang="ts">
  import { getTracker } from "./trackers.remote.js";

  const { params } = $props();
  const { id } = $derived(params);
  const { tracker, records } = $derived(await getTracker(id));
  const displayTracker = $derived({
    ...tracker,
    recordsCount: records.length,
  });
</script>

<pre>
  <code>
    {JSON.stringify(displayTracker ?? null, null, 2)}
  </code>
</pre>
<pre>
  <code>
    {JSON.stringify(records, null, 2)}
  </code>
</pre>
