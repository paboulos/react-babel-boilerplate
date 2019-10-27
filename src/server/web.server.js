const express = require('express');
// eslint-disable-next-line no-unused-vars
const { log, error } = console;

export default class WebServer {
  constructor(p = 3000){
    this.port = p;
    this.app = express();
    // The path that you provide to the express.static function is relative to the 
    // directory from where you launch your node process. If you run the express app 
    // from another directory, it’s safer to use the absolute path of the directory 
    // that you want to serve:
    // this.app.use('/static', express.static(path.join(__dirname, 'public')));
    this.app.use(express.static('dist/public'));
  }
  
  get Port(){ return this.port }

  start(){
    return new Promise((res,rej) => {
      try {
        this.server = this.app.listen(this.port, () => res());
      } 
      catch (error) {
        error(error);        
        rej(error);  
      }
    })
  }
  stop(){
    return new Promise((res,rej) => {
      try {
        this.server.close(() => res())
      } catch (error) {
        error(error.message);
        rej(error);
      }
    })
  }
}