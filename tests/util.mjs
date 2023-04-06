export async function setupRepo(repoPath, repo) {
  echo `Empty ${repoPath} dir...`;

  fs.emptyDirSync(repoPath);

  let gitFlags = ["--single-branch", "--depth", "1", repoPath];

  await $`git clone ${repo} ${gitFlags}`;
}

export async function getPkgTagVersion(packageName, tag) {
  // https://registry.npmjs.org/-/package/@rspack/cli/dist-tags
  const res = await fetch(
    "https://registry.npmjs.org/-/package/" + packageName + `/dist-tags`
  );
  const res_1 = await res.json();
  return res_1[tag];
}

export async function applyRspackPkgOverrides(rspackVersion) {
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
