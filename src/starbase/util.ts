import fs from 'node:fs/promises';
import path from 'path';

async function findGraphEntityJSONFiles(
  startPath: string,
  filter: string = 'entities',
): Promise<string[]> {
  let result: string[] = [];

  if (!(await pathExists(startPath))) {
    console.log('no dir ', startPath);
    return result;
  }

  const files = await fs.readdir(startPath);
  for (let i = 0; i < files.length; i++) {
    const pathname = path.join(startPath, files[i]);
    const stat = await fs.lstat(pathname);
    if (stat.isDirectory()) {
      if (pathname.indexOf(filter) >= 0) {
        const nestedFiles = await fs.readdir(pathname);
        for (let file of nestedFiles) {
          if (path.extname(file) === '.json') {
            result.push(path.join(pathname, file));
          }
        }
      } else {
        result = result.concat(
          await findGraphEntityJSONFiles(pathname, filter),
        ); // recurse
      }
    }
  }

  return result;
}

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export { findGraphEntityJSONFiles, pathExists };
