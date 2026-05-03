const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const codes = path.join(root, "codes");

const requiredFiles = ["index.html", "styles.css", "scenes.js", "app.js"];
const requiredDirs = ["images", "videos"];

function assertExists(target) {
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required path: ${path.relative(root, target)}`);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of requiredFiles) {
  assertExists(path.join(codes, file));
}

for (const dir of requiredDirs) {
  const source = path.join(root, dir);
  assertExists(source);
  fs.cpSync(source, path.join(dist, dir), { recursive: true });
}

for (const file of requiredFiles) {
  const source = path.join(codes, file);
  const target = path.join(dist, file);

  if (file === "scenes.js") {
    const content = fs
      .readFileSync(source, "utf8")
      .replaceAll("../images/", "./images/")
      .replaceAll("../videos/", "./videos/");
    fs.writeFileSync(target, content);
    continue;
  }

  fs.copyFileSync(source, target);
}

console.log(`Built ${path.relative(root, dist)} for Vercel.`);
