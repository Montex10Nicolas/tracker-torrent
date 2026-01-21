class TabManager {
  isOpen = $state(false);

  constructor() {
    this.isOpen = false;
  }

  change() {
    this.isOpen = !this.isOpen;
  }
}

export const tabManager = new TabManager();
