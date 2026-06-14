const fs = require("fs");
const path = require("path");

const csvPath = path.resolve(__dirname, "../local/Vocabulary - All.csv");
const outPath = path.resolve(__dirname, "../public/Dictionary.json");

// Minimal CSV parser: handles quoted fields containing commas and newlines.
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    const row = [];

    while (i < n) {
      if (text[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        let field = "";
        while (i < n) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              field += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            field += text[i++];
          }
        }
        row.push(field);
      } else {
        // Unquoted field — read until comma or newline
        let field = "";
        while (i < n && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
          field += text[i++];
        }
        row.push(field.trim());
      }

      if (i < n && text[i] === ",") {
        i++; // skip comma, read next field
      } else {
        break; // end of row
      }
    }

    // Skip \r\n or \n
    if (i < n && text[i] === "\r") i++;
    if (i < n && text[i] === "\n") i++;

    if (row.length > 0 && row[0] !== "") {
      rows.push(row);
    }
  }

  return rows;
}

const text = fs.readFileSync(csvPath, "utf8").replace(/\r\n/g, "\n");
const rows = parseCSV(text);

const dict = rows
  .filter((r) => r[0] && r[1])
  .map((r) => ({
    Word: r[0].trim(),
    Definition: r[1].trim(),
  }));

fs.writeFileSync(outPath, JSON.stringify(dict, null, 4));
console.log(`Wrote ${dict.length} words → ${outPath}`);
