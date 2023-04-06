#!/usr/bin/env zx

import "zx/globals";
import { setupRepo, getPkgTagVersion, applyRspackPkgOverrides } from "./util.mjs";

const { tag = "latest" } = argv;

async function setupRspackVersion(rspackTag) {
  if (rspackTag === 'default') {
    echo(`Testing rspack with the modern.js repo default version`);  
    return;
  }

  // fetch rspack version & overrides
  const rspackVersion = await getPkgTagVersion("@rspack/cli", rspackTag);

  if (rspackVersion) {
    await applyRspackPkgOverrides(rspackVersion);

    echo(`Testing rspack@${rspackTag} version:`, chalk.blue(rspackVersion));  
  } else {
    echo(`Testing rspack@${rspackTag} version is undefined, using default`);  
  }
}

async function setupModern(rspackTag) {
  await setupRspackVersion(rspackTag);

  await $`pnpm install --ignore-scripts --no-frozen-lockfile && pnpm prepare`;

  await $`node packages/toolkit/e2e/node_modules/@playwright/test/cli.js install`
}

(async function run() {
  const repoPath = "packages/modern.js";

  fs.ensureDirSync("packages");

  echo `Setup modern.js repo...`

  await setupRepo(repoPath, "https://github.com/web-infra-dev/modern.js.git")

  cd(repoPath);

  echo `Setup modern.js environment...`

  await setupModern(tag);

  await $`cd tests/e2e/builder && pnpm test:rspack`;
})();
