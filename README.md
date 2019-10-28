# Babel Boilerplate
## Usage
- yarn install
- yarn run build
- yarn run start
- yarn run clean
- flow-typed install mocha chai
- yarn test
- yarn debug

## Notes
- flow-typed install mocha chai
- Unit tests with Chai/Mocha
- Install flow-remove-types  tool for stripping Flow type annotations from test files. 
- Tests are executed from the temp dir
- Unit testing is limited to Server since modules are not being used for the client.
- start script uses nodemon (installed as a global library.)
- While app is running open a second terminal to rebuild.
