global.chai = require('chai');

global.chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

global.expect = global.chai.assert;

global.should = global.chai.should();

global.expect = global.chai.expect;
