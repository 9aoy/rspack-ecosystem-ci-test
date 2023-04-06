#!/usr/bin/env zx

import "zx/globals";
import { setupRepo, getPkgTagVersion } from "./util.mjs";

const { tag = "latest" } = argv;

async function setupModern(rspackTag) {
  // fetch rspack version & overrides
  const rspackVersion = await getPkgTagVersion("@rspack/cli", rspackTag);

  echo(`Testing rspack@${rspackTag} version:`, chalk.blue(rspackVersion));

  async function applyPackageOverrides(rspackVersion) {
    const pkgInfo = await fs.readJson("./package.json");

    fs.writeJSONSync(
      "./package.json",
      {
        ...pkgInfo,
        pnpm: {
          ...(pkgInfo.pnpm || {}),
          overrides: {
            ...(pkgInfo.pnpm?.overrides || {}),
            "@rspack/core": rspackVersion,
            "@rspack/dev-client": rspackVersion,
            "@rspack/dev-middleware": rspackVersion,
            "@rspack/plugin-html": rspackVersion,
            "@rspack/postcss-loader": rspackVersion,
          },
        },
      },
      { spaces: 2 }
    );
  }

  await applyPackageOverrides(rspackVersion);

  await $`pnpm install --ignore-scripts && pnpm prepare`;
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
