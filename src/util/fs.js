import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
// import fse from 'fs-extra';
// import temp from 'temp';
// import denodeify from 'denodeify';

const rootPath = process.cwd();
// const mkdir    = denodeify(fs.mkdir);
// const mkTmpDir = denodeify(temp.mkdir);

/*
 Node deprecated existsSync so this is a simple
 helper function wrapping try/catch around the new
 recommended approach of accessSync
 https://nodejs.org/api/fs.html#fs_fs_existssync_path
 */
export const fileExists = (filename) => {
  try {
    fs.accessSync(filename);
    return true;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
};

export const loadJsOrYaml = (string) => {
  var metadata = {};
  if (string.indexOf('yaml') !== -1) {
    metadata = yaml.safeLoad(
        fs.readFileSync(string, 'utf8')
      );
  } else if (string.indexOf('json') !== -1) {
    metadata = JSON.parse(
        fs.readFileSync(string, 'utf8')
      );
  }
  return metadata;
}

export const readFile = (filename) => {
  const filePath = path.join(rootPath, filename);
  return fs.readFileSync(filePath, 'utf8');
};