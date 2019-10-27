
import 'regenerator-runtime/runtime';
import WebServer from './web.server';


describe('Web Server', () => {
  let webserver = null;
  before(() => {
    // runs before all tests in this block
    webserver = new WebServer();
  });
  it('Should start',() => {
    webserver.start().should.eventually.equal(undefined);
  });
  it('Should stop', () => {
    webserver.stop().should.eventually.equal(undefined);
  });
});