<script lang="ts">
  import { fly, slide } from "svelte/transition";
  import { globalToats } from "./toast.svelte";

  const colors = {
    UPDATE: "bg-yellow-300",
    CREATE: "bg-green-400",
    DELETE: "bg-red-600",
  };
</script>

<div
  class="pointer-events-none absolute bottom-0 flex w-screen flex-col items-center justify-center space-y-4 overflow-hidden"
>
  {#each globalToats.toasts as [key, toast] (key)}
    {@const bgcolor = colors[toast.type]}
    <div
      in:slide={{ duration: 200 }}
      out:fly={{ y: 0, x: Math.random() <= 0.5 ? 1000 : -1000, duration: 200 }}
      class="pointer-events-auto grid max-w-64 grid-cols-8 gap-4 rounded-sm {bgcolor} px-1 py-2 text-black"
    >
      <p class="col-span-7">{toast.message}</p>
      <div class="col-span-1 flex min-w-full items-center justify-center">
        <button class="cursor-pointer" onclick={() => globalToats.delete(key)}>x</button>
      </div>
    </div>
  {/each}
</div>
