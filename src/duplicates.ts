import * as Bun from "bun";
import { join } from "node:path";

const __dirname = import.meta.dirname;
const filePath = join(__dirname, "../", "ai-list.txt");

const file = await Bun.file(filePath).text();
const lines = file.split("\n").filter(Boolean);

const set = new Set(lines);
const duplicates = lines.length - set.size;
if (duplicates > 0) {
  console.log("Removing:",duplicates,"duplicated entries found in ai-list.txt");

  const newContent = Array.from(set).sort().join("\n");
  await Bun.write(filePath, newContent);
} else {
  console.log("No duplicates found");
}
