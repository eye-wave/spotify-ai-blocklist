/**
 * @typedef {Object} Trashbin
 * @property {Record<string, boolean>} artists
 * @property {Record<string, boolean>} songs
 */

import fs from "node:fs";
import readline from "node:readline";

main();
async function main() {
  const filePath = new URL("./ai-list.txt", import.meta.url).pathname;
  const trashPath = new URL("./ai-trashbin.json", import.meta.url).pathname;

  const rl = readline.createInterface({ input: fs.createReadStream(filePath) });

  /** @type {Set<string>} */
  const seen = new Set();

  /** @type {Trashbin} */
  const trash = {
    artists: {},
    songs: {},
  };

  let total = 0;
  for await (const line of rl) {
    const id = parseId(line);
    if (!id) continue;

    seen.add(id);
    total += 1;
  }

  const sorted = Array.from(seen).sort();
  const duplicates = total - sorted.length;

  const lines = sorted.map((id) => {
    const url = "https://open.spotify.com/artist/" + id;
    const trashId = "spotify:artist:" + id;

    trash.artists[trashId] = true;
    return url;
  });

  console.log(
    duplicates === 0
      ? "No duplicates found."
      : `Found ${duplicates} duplicate entries.`
  );

  await writeFile(lines, filePath);
  await writeFile(trash, trashPath);
}

/**
 * @param {string} line
 */
function parseId(line) {
  if (!line.includes("artist")) return;

  const index = line.lastIndexOf("/");
  if (index === -1 || index + 23 > line.length) return null;

  for (let i = 0; i < 22; i++) {
    const char = line.charCodeAt(index + i + 1);

    if (char < 48) return null;
    if (char > 57 && char < 65) return null;
    if (char > 90 && char < 97) return null;
    if (char > 122) return null;
  }

  return line.slice(index + 1, index + 23);
}

/**
 * @param {string} file
 * @param {URL} path
 */
async function writeFile(file, path) {
  const content = Array.isArray(file)
    ? file.join("\n")
    : JSON.stringify(file, null, 2);

  await fs.promises.writeFile(path, content).catch(console.error);
}
