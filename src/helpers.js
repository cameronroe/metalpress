import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// var loadDataFiles = () => {
//   try {
//     var files = fs.readdirSync(path.resolve(config.basePath, './src/data'));
//     var dataFiles = {};
//     files.map((file) => {
//       dataFiles[file.split(path.extname(file))[0]] = `data/${file}`;
//     });
//     return dataFiles;
//   } catch(e) {
//     return {};
//   }
// };
// 
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

export function _fixPaginationQuirk(config) {
  try {
    for (var collection in config.pagination) {
      // check every pagination collection and load metadata into the original key
      if (typeof config.pagination[collection].pageMetadata !== 'string') {
        break;
      }
      let metadata = path.resolve(config.basePath, './src', config.pagination[collection].pageMetadata);
      config.pagination[collection].pageMetadata = loadJsOrYaml(metadata);
    }
  } catch (e) {
    console.log('could not resolve pagination metadata', e)
  }
}

export function _fixPaginationObject(config) {
  return (files, m, done) => {
    for (let file in files) {
      if (files[file].pagination) {
        if (files[file].collection && files[file].collection.length) {
          let collection = files[file].collection[0];
          let layout = config.pagination[`collections.${collection}`].layout;
          if (config.pagination[`collections.${collection}`].pageMetadata && config.pagination[`collections.${collection}`].pageMetadata.title) {
            files[file].title = config.pagination[`collections.${collection}`].pageMetadata.title;
          }
          files[file].layout = layout;
        }
      }
    }
    done();
  }
}