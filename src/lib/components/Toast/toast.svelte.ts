import { SvelteMap } from "svelte/reactivity";

interface Toast {
  message: string;
  type: "UPDATE" | "DELETE" | "CREATE";
}
// 2000ms = 2s
const DEFAULT_DELAY = 2000;
class Toasts {
  toasts = $state(new SvelteMap<string, Toast>());
  timeouts = $state(new SvelteMap<string, NodeJS.Timeout>())
  constructor() {
  }

  // Create a new Tiemout and add it to the map
  private newTimeout(id: string, toast: Toast, delay = DEFAULT_DELAY) {
    const timeout = setTimeout(() => {
      this.toasts.delete(id);
      this.timeouts.delete(id);
    }, delay);
    this.timeouts.set(id, timeout);
  }

  add(toast: Toast, delay = DEFAULT_DELAY) {
    const randomUUID = crypto.randomUUID();
    this.toasts.set(randomUUID, toast);
    this.newTimeout(randomUUID, toast, delay);

    return [randomUUID, toast, delay] as const;
  }

  update(id: string, toast: Toast, delay = DEFAULT_DELAY) {
    this.toasts.set(id, toast);
    this.timeouts.delete(id);

    this.newTimeout(id, toast, delay);
  }

  delete(uuid: string) {
    this.toasts.delete(uuid);
    const timeout = this.timeouts.get(uuid);
    clearTimeout(timeout);
  }
}

export const globalToats = new Toasts();
