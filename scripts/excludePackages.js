#!/usr/bin/env node

const util = require('util');
const ChildProcess = require('child_process');
const { join } = require('path');
const fs = require('fs');

const exec = util.promisify(ChildProcess.exec);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const excludedPackages = [
  'react-native-webview',
  'react-native-svg',
  'react-native-vector-icons',
  'react-native-inappbrowser-reborn',
];

let excludePackagesRecursive = async (projectPath, currentPath) => {
  if (!currentPath) {
    currentPath = projectPath;
  }
  const modules = await readdir(currentPath, { withFileTypes: true });

  for (let module of modules) {
    let moduleName = typeof module === 'string' ? module : module.name;
    if (excludedPackages.includes(moduleName) && currentPath !== projectPath) {
      console.log('removing library ', moduleName, ' from path ', currentPath);
      await exec(`rm -rf ${join(currentPath, moduleName)}`);
    } else if (
      fs.existsSync(join(currentPath, moduleName)) &&
      (await stat(join(currentPath, moduleName))).isDirectory()
    ) {
      await excludePackagesRecursive(
        projectPath,
        join(currentPath, moduleName),
      );
    }
  }
};

if (process.argv.length !== 3) {
  console.error('Usage:\n\n  node excludePackages.js PROJECT_PATH\n');
  process.exit(1);
}

let [dc1, dc2, projectPath] = process.argv;

excludePackagesRecursive(projectPath)
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

(async () => {
  try {
    await exec(
      'cp -r plugins/FirebaseAnalytics/FIRAnalyticsConnector.framework/ ios/Pods/FirebaseAnalytics/Frameworks/FIRAnalyticsConnector.framework/',
    );
    await exec(
      'cp -r plugins/FirebaseAnalytics/FirebaseAnalytics.framework/ ios/Pods/FirebaseAnalytics/Frameworks/FirebaseAnalytics.framework/',
    );
    console.log('Patch module done ✅✅🍺🍺🍺');
  } catch (error) {
    console.log('Patch module ❌❌❌', error);
  }
})();
