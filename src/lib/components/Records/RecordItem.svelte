<script lang="ts">
  import type { RecordSelect } from "$lib/server/db/schema";

  type Props = {
    record: RecordSelect;
  };
  const { record = $bindable() }: Props = $props();
  const totalRuntime = $derived.by(() => {
    if (record.duration === null) return null;
    let tempDuration = record.duration;
    const days = Math.floor(tempDuration / (60 * 24));
    tempDuration -= days * (60 * 24);
    const hours = Math.floor(tempDuration / 60);
    const minutes = tempDuration - hours * 60;

    return [days, hours, minutes] as const;
  });
</script>

<div>
  <p>{record.id}</p>
  <p>{record.name}</p>
  <p>{record.duration}</p>
</div>
