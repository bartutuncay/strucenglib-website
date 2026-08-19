# Web Page

This folder contains the static project page for Spatial Reasoning with GNNs.

## Files

- `index.html`: page structure and content
- `styles.css`: visual design and responsive layout
- `search.js`: browser-side search behavior
- `search-index.json`: generated index of page and section content
- `scripts/build-search-index.mjs`: search-index generator

## Preview

Build the search index whenever page content changes:

```bash
npm run build
```

The build scans HTML files in this folder and recreates `search-index.json`.
Search uses `fetch()`, so preview the site through a local server rather than
opening `index.html` directly.

If you want a local server with the artifact links working cleanly, run it from
the repository root:

```bash
python3 -m http.server 8000
```

Then visit the URL for this folder shown by the server.
