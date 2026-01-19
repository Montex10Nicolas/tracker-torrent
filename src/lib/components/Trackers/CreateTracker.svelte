<script lang="ts">
  import { createTracker } from "./trackers.remote";
</script>

<section class="flex flex-col items-center justify-center">
  <form {...createTracker} class="my-2 flex flex-col">
    <label class="flex flex-col">
      <span class="font-semibold"> Tracker Name </span>
      <input class="rounded-sm" {...createTracker.fields.name.as("text")} />
    </label>
    {#if createTracker.fields.name.issues()}
      {#each createTracker.fields.name.issues() as issue}
        <p>{issue.message}</p>
      {/each}
    {/if}
    <button
      class="my-1 w-full cursor-pointer rounded bg-amber-300 px-4 py-1 font-semibold uppercase"
      >Submit</button
    >
  </form>
</section>
