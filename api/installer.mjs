import path from 'path';
// eslint-disable-next-line no-unused-vars
import * as fs from 'fs';
import { globby } from 'globby';
import cp from "child_process";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function installDeps(functionDir, cb) {
  cp.exec("npm i", { cwd: functionDir }, cb)
}

(async () => {
  const findJSFiles = ['*/package.json', '!node_modules', '!**/node_modules']
  const directory = path.join(__dirname, '..', 'functions')
	const foldersWithDeps = await globby(findJSFiles, { cwd: directory })

  // eslint-disable-next-line no-unused-vars
  const folders = foldersWithDeps.map(fnFolder => {
    return fnFolder.substring(0, fnFolder.indexOf("package.json"))
  }).map((folder) => {
    installDeps(path.join(__dirname, '..', 'functions', folder), () => {
      console.log(`${folder} dependencies installed`)
    })
  })

})()