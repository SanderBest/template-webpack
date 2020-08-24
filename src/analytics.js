function createAnalytics() {
  let counter = 0;
  let isDestroyed = false;
  const listener = () => counter++;
  document.addEventListener("click", listener);
  return {
    destoy() {
      document.removeEventListener("click", listener);
      isDestroyed = true;
    },
    getClick() {
      if (isDestroyed) {
        return "analytics is destroyed";
      }
      return counter;
    },
  };
}

window.analytics = createAnalytics();
