#!/usr/bin/node
const fs = require("node:fs");
const path = require("node:path");

const TARGET_PATH = "/target";
// const TARGET_PATH = "/workdir/temp";
const RANKI_PREFIX = "_ranki2";
const PLUGINS_ROOT_PATH = "src/plugins";
const PLUGINS_BUILD_REL_PATH = "lib";
const RANKI_PATH = "src/apps/ranki-v2/build";

function rmFromTarget()
{
  const curr = fs.readdirSync(TARGET_PATH).filter(v => v.startsWith(RANKI_PREFIX));

  for (const f of curr) {
    const abspath = path.join(TARGET_PATH, f);
    console.log("Removing:", abspath);
    fs.rmSync(abspath);
  }

}

function copyToTarget()
{
  const pluginNames = fs.readdirSync("src/plugins");
  const pluginPaths = pluginNames.map((n) => path.join(
    PLUGINS_ROOT_PATH,
    n,
    PLUGINS_BUILD_REL_PATH
  ));

  [
    RANKI_PATH,
    ...pluginPaths,
  ].forEach((p) =>
  {
    console.log(p, ":");
    const files = fs.readdirSync(p).filter((v) => v.startsWith(RANKI_PREFIX));
    files.forEach((f) =>
    {
      // console.log(f, "=>", TARGET_PATH)
      const source = path.join(p, f);
      const dest = path.join(TARGET_PATH, f);
      console.log("  ", source, "=>", dest);
      fs.copyFile(source, dest);
    });
    // console.log(p, files);
  });
  // console.log(pluginPaths);
}

rmFromTarget();
copyToTarget();


// console.log("t", curr);

// console.log(plugins);
