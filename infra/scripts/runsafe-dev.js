const { execSync, spawn } = require("node:child_process");

startServices();

process.on("SIGINT", () => {
  console.info("[SIGINT]: Stopping services...");
  stopServices();
});

process.on("SIGTERM", () => {
  console.info("[SIGTERM]: Stopping services...");
  stopServices();
});

function stopServices() {
  console.info("All services stopped.");
  execSync("npm run services:down");
}

function startServices() {
  console.info("Starting services...");
  execSync("npm run services:up");
  execSync("npm run services:wait:database");
  execSync("npm run migrations:up");
  spawn("node", ["node_modules/next/dist/bin/next", "dev"], {
    stdio: "inherit",
  });
}
