<script lang="ts">
  import { createDisk } from "./disk.remote";
</script>

<section class="flex flex-col items-center justify-center">
  <form {...createDisk} class="my-2 flex flex-col">
    <label class="flex flex-col">
      <span class="font-semibold"> Disk Name </span>
      <input class="rounded-sm" {...createDisk.fields.name.as("text")} />
    </label>
    {#if createDisk.fields.name.issues()}
      {#each createDisk.fields.name.issues() as issue}
        <p>{issue.message}</p>
      {/each}
    {/if}
    <label class="flex flex-col">
      <span class="font-semibold"> Disk Space (GB) </span>
      <input class="rounded-sm" {...createDisk.fields.space.as("number")} step="any" />
    </label>
    {#if createDisk.fields.space.issues()}
      {#each createDisk.fields.space.issues() as issue}
        <p>{issue.message}</p>
      {/each}
    {/if}
    <button
      class="my-1 w-full cursor-pointer rounded bg-amber-300 px-4 py-1 font-semibold uppercase"
      >Submit</button
    >
  </form>
</section>
