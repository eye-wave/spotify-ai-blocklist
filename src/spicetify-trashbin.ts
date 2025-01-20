import * as Bun from "bun";
import { join } from "node:path";

const __dirname = import.meta.dirname;
const filePath = join(__dirname, "../", "ai-list.txt");

const file = await Bun.file(filePath).text();
const lines = file.split("\n");

const jsonFile: Record<string, Record<string, boolean>> = {
  songs: {},
  artists: {},
};

const ids = lines
  .map((line) => line.match(/[a-zA-Z0-9]{22}$/))
  .filter(Boolean)
  .map((id) => (jsonFile.artists[`spotify:artist:${id}`] = true));

const outPath = join(__dirname, "../generated/spicetify-trashbin.json");
await Bun.write(outPath, JSON.stringify(jsonFile, null, 2));
