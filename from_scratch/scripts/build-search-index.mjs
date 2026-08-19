import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = path.join(projectRoot, "search-index.json");
const ignoredDirectories = new Set([".git", "build", "dist", "node_modules"]);

const decodeEntities = (value) => {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-z]+);/gi, (entity, name) => namedEntities[name.toLowerCase()] ?? entity);
};

const textContent = (markup) =>
  decodeEntities(
    markup
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const findHtmlFiles = async (directory) => {
  const directoryEntries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of directoryEntries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      files.push(...(await findHtmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
};

const attributeValue = (attributes, name) => {
  const match = attributes.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1] || "";
};

const headingText = (markup, fallback) => {
  const heading = markup.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
  return heading ? textContent(heading[1]) : fallback;
};

const pageEntries = (filePath, html) => {
  const relativeUrl = path.relative(projectRoot, filePath).split(path.sep).join("/");
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const pageTitle = titleMatch ? textContent(titleMatch[1]) : path.basename(filePath, ".html");
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const searchableMarkup = mainMatch?.[1] || html;
  const sections = [...searchableMarkup.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)];

  if (!sections.length) {
    const content = textContent(searchableMarkup);
    return content ? [{ title: pageTitle, url: relativeUrl, content }] : [];
  }

  return sections.flatMap((section) => {
    const attributes = section[1];
    const markup = section[2];
    const content = textContent(markup);

    if (!content) {
      return [];
    }

    const sectionId = attributeValue(attributes, "id");
    const url = sectionId ? `${relativeUrl}#${encodeURIComponent(sectionId)}` : relativeUrl;

    return [
      {
        title: headingText(markup, pageTitle),
        url,
        content,
      },
    ];
  });
};

const htmlFiles = (await findHtmlFiles(projectRoot)).sort();
const searchIndex = [];

for (const filePath of htmlFiles) {
  const html = await fs.readFile(filePath, "utf8");
  searchIndex.push(...pageEntries(filePath, html));
}

searchIndex.sort((a, b) => a.url.localeCompare(b.url) || a.title.localeCompare(b.title));
await fs.writeFile(outputPath, `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");

console.log(`Built search-index.json with ${searchIndex.length} entries from ${htmlFiles.length} page(s).`);
