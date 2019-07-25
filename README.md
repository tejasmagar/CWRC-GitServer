![Picture](http://cwrc.ca/logos/CWRC_logos_2016_versions/CWRCLogo-Horz-FullColour.png)

# CWRC-GitServer

[![Travis](https://img.shields.io/travis/cwrc/CWRC-GitServer.svg)](https://travis-ci.org/cwrc/CWRC-GitServer)
[![Codecov](https://img.shields.io/codecov/c/github/cwrc/CWRC-GitServer.svg)](https://codecov.io/gh/cwrc/CWRC-GitServer)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges) 

## Table of Contents

1. [Overview](#overview)
1. [API](#api)
1. [Demo](#demo)
1. [Setup](#setup)
<!---
1. [Development](#development)
2. [Development Setup](#install)
2. [Development Server](#development-server)
2. [Testing](#testing)
2. [Coverage](#coverage)
2. [Commitizen](#commitizen)
2. [Travis](#travis)
2. [Git Hooks](#git-hooks)
-->



### Overview

The CWRC-GitServer is a node.js Express server acting as a proxy between [cwrc-git-dialogs](https://github.com/cwrc/cwrc-git-dialogs) and the GitHub API. The CWRC-GitServer in turn invokes [CWRC-Git](https://github.com/cwrc/CWRC-Git) which is used to make the actual calls to GitHub.

CWRC-GitServer provides http endpoints for listing, creating, and updating XML documents.

### API

[View the full API here](https://github.com/cwrc/CWRC-GitServer/blob/master/API.md)

### Demo

The [CWRC-GitWriter Sandbox](https://cwrc-writer.cwrc.ca) is running an instance of [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter), which uses the code from [CWRC-WriterBase](https://github.com/cwrc/CWRC-WriterBase) and [cwrc-git-dialogs](https://github.com/cwrc/cwrc-git-dialogs). There is a corresponding server component running this code and using the [CWRC-Git](https://github.com/cwrc/CWRC-Git) module. The same code is easily (for someone with modest development experience) installed on any server to run your own instance.  If you are looking to put together your own CWRC-Writer, [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) is a good place to start.


### Setup

These are the steps we've used to install the [sandbox version of the CWRC-GitWriter](https://cwrc-writer.cwrc.ca):

Install node.js on a server (one approach for ubuntu is described here:  https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Clone this repository to the server, or copy the files to the server.

On the server switch into the CWRC-GitServer directory and run:

`npm install` (to install the npm packages on the server)

Install pm2 to run Express as a service:

```
sudo npm install pm2 -g
cd ~/cwrcserver
pm2 start ./bin/www
```
<!---
and to start automatically (from https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04):

`pm2 startup ubuntu`

- which should tell you to run some like this:  `sudo su -c "env PATH=$PATH:/usr/bin pm2 startup ubuntu -u ubuntu --hp /home/ubuntu"`
- run what it tells you to run

install nginx:

`sudo apt-get install nginx`

and change it's config:

`sudo vi /etc/nginx/sites-available/default`

to:

```
server {
    listen 80;

    server_name your_ip_goes_here;
    
    location / {
                root /home/ubuntu/cwrcwriter;
        }

    location /github {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

restart nginx:

`sudo service nginx restart`
-->

You will also have to install the [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) code on the server, as explained in its README.

<!---
### Development

#### Development Setup

* Fork or clone (depending on your role in the project) the repo to your local machine.

* `npm install` to install the node.js dependencies 
    
    NOTE:  we use `npm set save-exact true` to save dependencies as exact version numbers so NPM should install exact versions when you run install

* The config.js file specifies several passwords and tokens.  You'll have to set these values appropriately in your cloned repo.  To prevent git from noticing that you've changed the file (so that you don't inadvertently commit the file and push it to the public repo thereby exposing the passwords) use:

`git update-index --skip-worktree config.js`

* write a test (or two)for your new functionality (in 'spec' directory)

* `npm test` to start mocha and automatically rerun the tests whenever you change a file

* change some stuff to satisfy new test

#### Development Server

Start the express server in DEBUG mode:

`DEBUG=cwrc-server:* npm start`

#### Testing

Testing uses mocha, chai, and chai-http.  

`npm test` to run tests continuously during development
`npm test:single` to run a single test.  Also generates code coverage statistics (using Istanbul)

#### Coverage

Code coverage statistics are also run by Travis during the travis build and published to codecov.io

You can also browse the code coverage reports locally by opening:

`coverage/lcov-report/index.html`

in the project directory.

#### Commitizen

When you've got some changes to commit, please use `npm run cm` rather than `git commit`.  `npm run cm` will invoke [Commitizen](https://github.com/commitizen) to structure the commit messages using this standard: [conventional-changelog-angular](https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/index.js).

#### Travis

The site is built on Travis whenever a push is made to GitHub.

#### Git Hooks

A pre-commit git hook is setup by ghooks to run tests and verify coverage whenever a `git commit` is made.  If the tests fail or the coverage is below the tresholds set in package.json:

`"check-coverage": "istanbul check-coverage --statements 100 --branches 100 --functions 100 --lines 100"`

then the commit will fail.

-->
