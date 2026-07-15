import { execFileSync } from "node:child_process";

const isLinuxX64 = process.platform === "linux" && process.arch === "x64";

if (!isLinuxX64) {
  process.exit(0);
}

try {
  execFileSync("npm", ["install", "--no-save", "--ignore-scripts", "@tailwindcss/oxide-linux-x64-gnu@4.3.2"], {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Failed to install @tailwindcss/oxide-linux-x64-gnu for Linux x64 build.");
  throw error;
}
