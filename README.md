## Build For FrontEnd Engineering

Before to have "nvm" installed. If you already have node installed, you should
check the installed node, npm, webpack and webpack-dev-server, by running the
following commands:

    which node
    node --version
    which npm
    npm --version

    which webpack
    webpack --version

    which webpack-dev-server
    webpack-dev-server --version

To install node NVM, simply run:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash

Use nvm to install node v8.8

    nvm use v8.8

And then, update your npm:

    npm install -g npm

And then install the local dependencies:

    npm install 

If you encounterred an error like this:

    ERR! Cannot read property '0' of undefined

Simply do this to fix the issue:

    rm -rf node_modules package-lock.json

To use the local typescript, you can link the local typescript to the global
typescript:

    npm link typescript


### Run up development 

    // Make sure you have bundle dll first, which should be generated after `npm install`
    npm start
    
Then you can visit <https://localhost:3000/>
and start development.

### Lint your source code

Default will lint all code under `src`. Pass file position as paramter.

    npm run lint
    // auto fix code if the rule has the fixer 
    npm run lint:fix
    // only lint utils
    npm run lint -- src/utils/index.ts


### Trouble Shooting

1. error Cannot read property '0' of undefined

If you encountered error like this, try `npm install -g npm@5.2`

2. Webpack doesn't bundle newest code as you want

Clean cache with `rm -rf .cache-loader` 