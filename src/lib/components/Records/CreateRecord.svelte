<script lang="ts">
  import { getAllDisks, getAllTrackers } from "$lib/utils/remotes/db.remote";
  import type { RemoteFormIssue } from "@sveltejs/kit";
  import { insertRecord } from "./record.remote";

  const disks = $derived(await getAllDisks());
  const trackers = $derived(await getAllTrackers());

  const { fields } = $derived(insertRecord);

  const today = new Date();
  const today_in_timelocal = `${today.getFullYear()}-${addZeroDate(today.getMonth() + 1)}-${addZeroDate(
    today.getDate(),
  )}T${addZeroDate(today.getHours())}:${addZeroDate(today.getMinutes())}`;

  function init() {
    fields.completedAt.set(today_in_timelocal);
    fields.name.set("");
    fields.size.set(0);
    fields.duration.set(0);
    fields.upTime.set(0);
    fields.isWatched.set(false);
    fields.isDeleted.set(false);
    fields.name.set("");
    fields.updatedAt.set(Number(new Date()));
  }
  init();

  function addZeroDate(value: number) {
    return String(value).padStart(2, "0");
  }

  function uptimeNeeded(size: number) {
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
  }
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
    {...insertRecord.enhance(async ({ submit, data }) => {
      console.info("TimeNeededEnhance: ", fields.upTimeNeeded.value());
      await submit();
    })}
    class="flex flex-col"
  >
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2">
      <input {...fields.id.as("hidden", crypto.randomUUID())} />
      <input {...fields.upTimeNeeded.as("number")} type="hidden" />
      <label>
        Name
        <input {...fields.name.as("text")} />
        {@render displayIssue(fields.name.issues())}
      </label>
      <label>
        Size
        <input {...fields.size.as("number")} step="0.01" />
        {@render displayIssue(fields.size.issues())}
      </label>
      <label>
        Duration
        <input {...fields.duration.as("number")} />
        {@render displayIssue(fields.duration.issues())}
      </label>
      <label>
        Watched
        <input {...fields.isWatched.as("checkbox")} defaultvalue="false" />
        {@render displayIssue(fields.isWatched.issues())}
      </label>
      <label>
        Deleted
        <input {...fields.isDeleted.as("checkbox")} defaultvalue="false" />
        {@render displayIssue(fields.isDeleted.issues())}
      </label>
      <label>
        Uptime (minutes)
        <input {...fields.upTime.as("number")} />
        {@render displayIssue(fields.upTime.issues())}
      </label>
      <label>
        Completed At
        <input {...fields.completedAt.as("datetime-local")} />
        {@render displayIssue(fields.completedAt.issues())}
      </label>
      <label>
        Tracker
        <select {...fields.trackerID.as("select")}>
          {#each trackers as tracker (`disk-${tracker.id}`)}
            <option value={tracker.id}>{tracker.name}</option>
          {/each}
        </select>
        {@render displayIssue(fields.trackerID.issues())}
      </label>
      <label>
        Disk
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
    </div>
    <button
      onclick={(e) => {
        console.log("You are here");
        e.preventDefault();
        const needed = uptimeNeeded(fields.size.value());
        console.log(needed);
        if (needed === null) {
          console.log("null");
          insertRecord.fields.upTimeNeeded.set(33);
        } else {
          console.log("correct");
          insertRecord.fields.upTimeNeeded.set(needed);
        }
        const form = e.currentTarget.form!;
        form.requestSubmit();
      }}
      class=" m-2 cursor-pointer rounded-sm bg-sky-800 py-3 font-semibold text-white uppercase"
    >
      Submit
    </button>
  </form>
</div>
