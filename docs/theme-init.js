(() => {
  try {
    const savedTheme = localStorage.getItem("strucenglib-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.dataset.theme = savedTheme;
    }
  } catch {
    // The system preference remains the fallback when storage is unavailable.
  }
})();
