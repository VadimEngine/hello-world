const fs = require("fs");
const path = require("path");

const LIST_SIZE = 25;

const dictPath = path.resolve(__dirname, "../public/Dictionary.json");
const outPath = path.resolve(__dirname, "../public/WordLists.json");

const dict = JSON.parse(fs.readFileSync(dictPath, "utf8"));
const n = dict.length;

// Fisher-Yates shuffle of all indices
const indices = Array.from({ length: n }, (_, i) => i);
for (let i = n - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [indices[i], indices[j]] = [indices[j], indices[i]];
}

// Chunk into lists of LIST_SIZE (drop any partial final chunk)
const lists = [];
for (let i = 0; i + LIST_SIZE <= indices.length; i += LIST_SIZE) {
  const id = Math.floor(i / LIST_SIZE);
  lists.push({
    id,
    name: `List ${id + 1}`,
    indices: indices.slice(i, i + LIST_SIZE),
  });
}

fs.writeFileSync(outPath, JSON.stringify(lists, null, 2));
console.log(`Generated ${lists.length} lists of ${LIST_SIZE} from ${n} words → ${outPath}`);
