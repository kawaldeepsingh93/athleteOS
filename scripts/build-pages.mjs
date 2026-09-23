import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const api = "src/app/api";
const parked = "src/app/_api_server";

if (existsSync(api)) renameSync(api, parked);

const env = {
  ...process.env,
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_STATIC: "1",
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "/athleteOS",
};

let code = 0;
try {
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  code = result.status ?? 1;
  if (code === 0) writeFileSync("out/.nojekyll", "");
} finally {
  if (existsSync(parked) && !existsSync(api)) renameSync(parked, api);
}
process.exit(code);
