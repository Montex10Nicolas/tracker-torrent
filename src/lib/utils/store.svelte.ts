export let isTabRoutesOpen = $state(false);
class TabManager {
  isOpen = $state(false);

  constructor(value = false) {
    this.isOpen = value;
  }

  change() {
    this.isOpen = !this.isOpen;
  }
}

export const tabManager = new TabManager();
