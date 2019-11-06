
/* eslint-disable no-unused-vars */
const fs = require('fs');
var rimraf = require("rimraf");
// const readdirp = require('readdirp');
const path = require('path');
const stream = require('stream');
const mkdirp = require('mkdirp');

/**
 * Writes content to filesystem using an array of objects
 * object format: {path: filepath, content: transpiled code}
 */
class ToFileStream extends stream.Writable {
  constructor() {
    super({objectMode: true});
  }
  _write (chunk, encoding, callback) {
    mkdirp(path.dirname(chunk.path), err => {
      if (err) {
        return callback(err);
      }
      fs.writeFile(chunk.path, chunk.content, callback);
    });
  }
}

/**
 * resolve directory with the filesystem
 */
function resolveDir(Path) {
  return new Promise((resolve,reject) => {
    const resPath = path.resolve(__dirname, Path);
    console.log(`check directory ${resPath}`);
      fs.stat(resPath, (er, stat) => {
        if(er && er.code === 'ENOENT'){
          resolve('NOT_FOUND');
        }
        if(er){
          reject(er);
        }
        if(stat && stat.isDirectory()) {
          resolve(resPath);
        }else{
          resolve('NOT_FOUND');
        }
      });
  });
}

/**
 * Recursive cleanup directory
 */
function clearFiles(Path) {
  return new Promise((resolve, reject) => {
    try {
      rimraf(Path, (err) => {
        if(err) reject(err);
        resolve('Success');
      });
    }catch(e) {
      reject(e);
    }
  });
}

/**
 * Recusively reads the files from the source directory
 * using readdir with nested callbacks.
 */
function sourceTree(dir, cb){
  const srcDir = path.resolve(__dirname, dir);
  let files = [];
  fs.readdir(srcDir, (err, list) => {
    if (err) return cb(err, null);
    let fileCount = list.length;
    if(!list || !fileCount) return cb(null, files);
    list.forEach((Path) => {
      Path = path.resolve(srcDir, Path);
        fs.stat(Path, (err, stat) => {
         if (err) return cb(err, null);
         if(stat && stat.isDirectory()) {
          sourceTree(Path, (err, result) => {
            files = files.concat(result);
            if (!--fileCount) return cb(null, files);
          });
         }else {
          files.push(Path);
          if (!--fileCount) return cb(null,files);
         }
        });
    });
  });
}

module.exports = {
  clearFiles,
  sourceTree,
  ToFileStream,
  resolveDir
}