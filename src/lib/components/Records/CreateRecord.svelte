<script lang="ts">
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import type { RemoteFormIssue } from "@sveltejs/kit";
  import { insertRecord } from "./record.remote";
  import { addZeroDate, uptimeNeeded } from "$lib/utils/index.svelte";
  import { globalToats } from "../Toast/toast.svelte";

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  const { fields } = $derived(insertRecord);

  const today = new Date();
  const today_in_timelocal = `${today.getFullYear()}-${addZeroDate(today.getMonth() + 1)}-${addZeroDate(
    today.getDate(),
  )}T${addZeroDate(today.getHours())}:${addZeroDate(today.getMinutes())}`;

  function init() {
    fields.name.set("");
    fields.size.set(1);
    fields.duration.set(1);
    fields.upTime.set(1);
    fields.isWatched.set(false);
    fields.isDeleted.set(false);
    fields.updatedAt.set(Number(new Date()));
    fields.completedAt.set(today_in_timelocal);
  }
  init();

  let nameInputField: HTMLInputElement | undefined = $state();
</script>

{#snippet displayIssue(issues: RemoteFormIssue[] | undefined)}
  {#each issues as issue}
    <details>
      <summary>
        {issue.path}
      </summary>
      {issue.message}
    </details>
    <p>{issue.message}</p>
  {/each}
{/snippet}

<div class="p-2">
  <form
    {...insertRecord.enhance(async ({ submit, form, data }) => {
      globalToats.add({
        type: "CREATE",
        message: `Creating ${data.name}`,
      });
      await submit();
      form.reset();
      nameInputField?.focus();
    })}
    class="flex flex-col"
  >
    <div class="grid grid-cols-5 gap-x-8 gap-y-2">
      <input {...fields.upTimeNeeded.as("number")} type="hidden" />
      <label>
        <span> Name </span>
        <input {...fields.name.as("text")} bind:this={nameInputField} />
        {@render displayIssue(fields.name.issues())}
      </label>
      <label>
        <span> Size </span>
        <input {...fields.size.as("number")} step="0.01" />
        {@render displayIssue(fields.size.issues())}
      </label>
      <label>
        <span> Duration (minutes) </span>
        <input {...fields.duration.as("number")} />
        {@render displayIssue(fields.duration.issues())}
      </label>
      <label class="items-center justify-center">
        <span> Watched </span>
        <input {...fields.isWatched.as("checkbox")} />
        {@render displayIssue(fields.isWatched.issues())}
      </label>
      <label class="items-center justify-center">
        <span> Deleted </span>
        <input class="checked:bg-red-800" {...fields.isDeleted.as("checkbox")} />
        {@render displayIssue(fields.isDeleted.issues())}
      </label>
      <label>
        <span> Uptime (minutes) </span>
        <input {...fields.upTime.as("number")} />
        {@render displayIssue(fields.upTime.issues())}
      </label>
      <label>
        <span> Completed At </span>
        <input {...fields.completedAt.as("datetime-local")} />
        {@render displayIssue(fields.completedAt.issues())}
      </label>
      <label>
        <span> Tracker </span>
        <select {...fields.trackerID.as("select")}>
          {#each trackers as tracker (`disk-${tracker.id}`)}
            <option value={tracker.id}>{tracker.name}</option>
          {/each}
        </select>
        {@render displayIssue(fields.trackerID.issues())}
      </label>
      <label>
        <span> Disk </span>
        <select {...fields.diskID.as("select")}>
          {#each disks as disk (`disk-${disk.id}`)}
            <option value={disk.id}>{disk.name} ({disk.space})</option>
          {/each}
        </select>
        {@render displayIssue(fields.diskID.issues())}
      </label>
      {@render displayIssue(fields.upTimeNeeded.issues())}
      <input {...fields.updatedAt.as("number")} type="hidden" />
      {@render displayIssue(fields.updatedAt.issues())}
      <label>
        <span> Don't mind me </span>
        <input type="text" disabled value="this is for appearance only" class="h-full text-xs" />
      </label>
    </div>
    <button
      onclick={async (e) => {
        e.preventDefault();
        const form = e.currentTarget.form!;
        const needed = uptimeNeeded(fields.size.value());
        if (needed === null) {
          return;
        }

        async function setCorrectedUptime() {
          insertRecord.fields.upTimeNeeded.set(Math.ceil(needed!));
        }

        await setCorrectedUptime().then(() => {
          form.requestSubmit();
        });
      }}
      class="mt-4 cursor-pointer rounded-sm bg-amber-300 py-3 font-semibold text-black uppercase"
    >
      Submit
    </button>
  </form>
</div>

<style>
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  label > span {
    font-weight: 700;
  }

  input,
  select {
    border-radius: 0.25rem;
  }

  input[type="number"] {
    text-align: right;
    -moz-appearances: textfield;
    appearance: textfield;
  }

  label > input[type="checkbox"] {
    width: 100%;
    height: 2.5rem;
    outline: none;
    cursor: pointer;
  }
</style>
