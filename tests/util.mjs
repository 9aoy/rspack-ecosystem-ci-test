export async function setupRepo(repoPath, repo) {
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
