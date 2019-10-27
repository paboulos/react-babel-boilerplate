import '@babel/polyfill';
import WebServer from './web.server';


const { log, error } = console;
let webserver = new WebServer(3000);
webserver.start().then(() => log(`serving from http://localhost:${webserver.Port}`)).catch(err => error(err));
 