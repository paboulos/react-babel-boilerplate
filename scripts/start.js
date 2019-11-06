/* eslint-disable no-unused-vars */
/**
 * Uses Babel Core API
 * https://babeljs.io/docs/en/babel-core#transformfilesync
 */
const babel = require("@babel/core");
const path = require('path');
const fs = require('fs');
const {
  clearFiles,
  sourceTree,
  ToFileStream,
  resolveDir
} = require("./fileHandler.js");

const discarded = ['test','type-declarations'];
let destList = [];

resolveDir('../dist').then(resp => {
  if (resp !== 'NOT_FOUND'){
    clearFiles(resp).then(response => {
      console.log(` ${resp} directory cleaned with ${response}` );
      processFiles('../src');
    }).catch((e) => console.log(`clearFiles error ${e}`));
  }else {
    processFiles('../src');
  }
}).catch( (error) => console.log('error', error));

/**
 */
function processFiles(dir){
  sourceTree(dir, (err, data) => {
     if(err) {
       throw err;
     }
     // clean up src file list
     const filtered = data.filter(path => discarded
     .filter(name => path.search(name)+1).length === 0)
     .map((file) => ("./"+path.relative(__dirname+"/..", file).replace(/\\/g,'/')));
     destList = filtered.map(file => {
        if (file.search('client') + 1) {
          return {
            path: file.replace('src/client','dist/public'),
            content: null
          }
        }
        return {
            path: file.replace('src','dist'),
            content: null
          }
     });
     // pass cleaned src list to Babel
     Promise.all(filtered.map(tranformCode)).then(
       processed => savetoFile(processed)
    ).catch(err => console.log(err));
  })
}

function savetoFile(processed) {
  console.log(`${processed.length} objects created`);
  const fileStream = new ToFileStream();
  processed.forEach(
    (obj) => {
      console.log(`Writing ${obj.path}`);
      fileStream.write(obj);
    });
  fileStream.end( () => {
    console.log(`Finish saving new files and ready to start server`);
    startServer();
  });
}
 
function tranformCode (value, index) {
        if (value.search('index.html') + 1) {
          return new Promise( // Could of used the Node util.promisify for an async cb 
            (resolve, reject) => {
              fs.readFile(value, (err, data) => {
                if (err) reject(err);
                resolve({
                 path: destList[index].path,
                 content: data
                });
              });
          });
        }
        return babel.transformFileAsync(value, null).then(result => {
         return {
          path: destList[index].path,
          content: result.code
        }
       });
    }

  function startServer(){
    let serverPath = null;
    const args = process.argv.slice(2);
    if (!args || args.length % 2 !== 0) throw new Error('Invalid Arguments');

    // hash args and capture path value for require
    const argObj = args.reduce((acc, arg, idx) => {
     // odd is key, even is value
     if ((idx + 1) % 2 === 0) acc[args[idx-1]] = arg.trim();
     else acc[arg.trim()] = null;
     return acc;
    },{});
    serverPath = argObj["-path"];
    if (!serverPath) throw new Error('Invalid Start Path Argument');
    console.log(`starting server from file ${serverPath}\n`);
    require(serverPath);
  }