(() => {
  const scriptUrl = document.currentScript?.src || document.baseURI;
  const siteRoot = new URL(".", scriptUrl);
  const siteUrl = (path = "") => new URL(path, siteRoot).href;

  const headerMarkup = `
    <header class="site-header">
      <a class="brand" href="${siteUrl("index.html")}" aria-label="StrucEngLib home">
        <img
          class="site-logo"
          src="${siteUrl("assets/logo-web-2.svg")}"
          data-logo-light="${siteUrl("assets/logo-web-2.svg")}"
          data-logo-dark="${siteUrl("assets/logo-web-2-d.svg")}"
          alt="StrucEngLib"
        />
      </a>
      <div class="header-actions">
        <nav class="nav-links" aria-label="Project sections">
          
          <details class="nav-dropdown">
            <summary>Examples</summary>
            <div class="nav-dropdown-menu">
                <a href="${siteUrl("content/ansys_act/get_started.html")}">
                  Get Started
                </a>
                <a href="${siteUrl("content/ansys_act/sandwichmodel.html")}">
                  Sandwich Model
                </a>
                <a href="${siteUrl("content/ansys_act/seismic.html")}">
                  Seismic
              </a>
            </div>
          </details>

          <details class="nav-dropdown">
            <summary>ANSYS Plugin</summary>
            <div class="nav-dropdown-menu">
              <a href="${siteUrl("content/ansys_act/get_started.html")}">
                Get Started
              </a>
              <a href="${siteUrl("content/ansys_act/sandwichmodel.html")}">
                Sandwich Model
              </a>
              <a href="${siteUrl("content/ansys_act/seismic.html")}">
                Seismic Analysis
              </a>
            </div>
          </details>
          <a href="${siteUrl("index.html#nonlinear")}">Non-Linear Analysis</a>

          <details class="nav-dropdown">
            <summary>Documentation</summary>
            <div class="nav-dropdown-menu">
                <a href="${siteUrl("content/ansys_act/get_started.html")}">
                  ACT User Reference
                </a>
                <a href="${siteUrl("content/ansys_act/sandwichmodel.html")}">
                  Usermat User Reference
                </a>
                <a href="${siteUrl("content/ansys_act/sandwichmodel.html")}">
                  Videos
                </a>
                <a href="${siteUrl("content/ansys_act/seismic.html")}">
                  ACT Backend
              </a>
            </div>
          </details>


          <a href="${siteUrl("index.html#dev_guide")}">Development Guide</a>

          <a href="${siteUrl("content/about/about.html")}">About</a>

        </nav>
        <div class="site-search">
          <label class="visually-hidden" for="search">Search website</label>
          <input
            type="search"
            id="search"
            placeholder="Search"
            autocomplete="off"
            spellcheck="false"
            aria-controls="search-results"
            aria-expanded="false"
          />
          <div id="search-results" class="search-results" hidden>
            <p id="search-status" class="search-status" aria-live="polite"></p>
            <ul class="search-results-list"></ul>
          </div>
        </div>
        <button
          class="theme-switch"
          type="button"
          role="switch"
          aria-checked="false"
          aria-label="Use dark mode"
        >
          <span class="theme-switch-symbol" aria-hidden="true">&#9728;</span>
          <span class="theme-switch-track" aria-hidden="true">
            <span class="theme-switch-thumb"></span>
          </span>
          <span class="theme-switch-symbol" aria-hidden="true">&#9790;</span>
        </button>
      </div>
    </header>`;

  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const activeTheme = () =>
    root.dataset.theme || (systemTheme.matches ? "dark" : "light");

  const updateThemeControls = (header) => {
    const themeSwitch = header.querySelector(".theme-switch");
    const dropdowns = header.querySelectorAll(".nav-dropdown");

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("toggle", () => {
        if (!dropdown.open) return;

        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.open = false;
          }
        });
      });
    });
    const siteLogo = header.querySelector(".site-logo");
    const isDark = activeTheme() === "dark";
    const nextTheme = isDark ? "light" : "dark";

    themeSwitch.setAttribute("aria-checked", String(isDark));
    themeSwitch.setAttribute("aria-label", `Use ${nextTheme} mode`);
    themeSwitch.title = `Use ${nextTheme} mode`;
    siteLogo.src = isDark ? siteLogo.dataset.logoDark : siteLogo.dataset.logoLight;
  };

  document.querySelectorAll("site-header").forEach((container) => {
    container.innerHTML = headerMarkup;
    const header = container.querySelector(".site-header");
    const themeSwitch = header.querySelector(".theme-switch");

    themeSwitch.addEventListener("click", () => {
      const nextTheme = activeTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;

      try {
        localStorage.setItem("strucenglib-theme", nextTheme);
      } catch {
        // The selected theme still applies for the current page view.
      }

      updateThemeControls(header);
    });

    systemTheme.addEventListener("change", () => {
      if (!root.dataset.theme) updateThemeControls(header);
    });

    updateThemeControls(header);
  });
})();
