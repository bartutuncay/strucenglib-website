(() => {
  const searchScript = document.currentScript;
  const searchIndexUrl = new URL("search-index.json", searchScript?.src || document.baseURI);
  const search = document.querySelector("#search");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  const resultsList = results?.querySelector(".search-results-list");

  if (!search || !results || !status || !resultsList) {
    return;
  }

  let indexPromise;

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();

  const loadIndex = () => {
    indexPromise ??= fetch(searchIndexUrl, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Search index request failed: ${response.status}`);
        }

        return response.json();
      })
      .then((entries) => (Array.isArray(entries) ? entries : []));

    return indexPromise;
  };

  const rankEntry = (entry, terms) => {
    const title = normalize(entry.title || "");
    const content = normalize(entry.content || "");
    const combined = `${title} ${content}`;

    if (!terms.every((term) => combined.includes(term))) {
      return null;
    }

    return terms.reduce((score, term) => {
      if (title === term) return score;
      if (title.startsWith(term)) return score + 1;
      if (title.includes(term)) return score + 2;
      return score + 5;
    }, 0);
  };

  const createExcerpt = (content, terms) => {
    const plainContent = String(content || "").trim();
    const normalizedContent = normalize(plainContent);
    const positions = terms
      .map((term) => normalizedContent.indexOf(term))
      .filter((position) => position >= 0);
    const matchPosition = positions.length ? Math.min(...positions) : 0;
    const start = Math.max(0, matchPosition - 55);
    const end = Math.min(plainContent.length, start + 150);
    const prefix = start > 0 ? "…" : "";
    const suffix = end < plainContent.length ? "…" : "";

    return `${prefix}${plainContent.slice(start, end).trim()}${suffix}`;
  };

  const closeResults = () => {
    results.hidden = true;
    search.setAttribute("aria-expanded", "false");
  };

  const openResults = () => {
    results.hidden = false;
    search.setAttribute("aria-expanded", "true");
  };

  const renderResults = (matches, query, terms) => {
    resultsList.replaceChildren();
    openResults();

    if (!matches.length) {
      status.textContent = `No results for “${query}”.`;
      return;
    }

    status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"}`;

    matches.forEach(({ entry }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const title = document.createElement("strong");
      const excerpt = document.createElement("span");

      link.className = "search-result-link";
      link.href = entry.url;
      title.className = "search-result-title";
      title.textContent = entry.title;
      excerpt.className = "search-result-excerpt";
      excerpt.textContent = createExcerpt(entry.content, terms);

      link.append(title, excerpt);
      item.append(link);
      resultsList.append(item);
    });
  };

  const runSearch = async () => {
    const query = search.value.trim();

    if (!query) {
      resultsList.replaceChildren();
      status.textContent = "";
      closeResults();
      return;
    }

    const terms = normalize(query).split(/\s+/).filter(Boolean);
    status.textContent = "Searching…";
    resultsList.replaceChildren();
    openResults();

    try {
      const index = await loadIndex();

      if (query !== search.value.trim()) {
        return;
      }

      const matches = index
        .map((entry) => ({ entry, score: rankEntry(entry, terms) }))
        .filter(({ score }) => score !== null)
        .sort((a, b) => a.score - b.score || a.entry.title.localeCompare(b.entry.title))
        .slice(0, 8);

      renderResults(matches, query, terms);
    } catch {
      status.textContent = "Search is unavailable. Please reload the page and try again.";
    }
  };

  search.addEventListener("input", runSearch);
  search.addEventListener("focus", () => {
    if (search.value.trim()) {
      runSearch();
    }
  });

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeResults();
      return;
    }

    if (event.key === "ArrowDown") {
      const firstResult = resultsList.querySelector("a");

      if (firstResult) {
        event.preventDefault();
        firstResult.focus();
      }
    }
  });

  resultsList.addEventListener("keydown", (event) => {
    if (!event.target.matches("a")) {
      return;
    }

    const links = [...resultsList.querySelectorAll("a")];
    const currentIndex = links.indexOf(event.target);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(currentIndex + 1) % links.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (currentIndex === 0) {
        search.focus();
      } else {
        links[currentIndex - 1].focus();
      }
    } else if (event.key === "Escape") {
      closeResults();
      search.focus();
    }
  });

  resultsList.addEventListener("click", closeResults);
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".site-search")) {
      closeResults();
    }
  });
})();
