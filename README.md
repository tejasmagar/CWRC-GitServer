![Picture](http://www.cwrc.ca/wp-content/uploads/2010/12/CWRC_Dec-2-10_smaller.png)

# CWRC-GitServer

[![Travis](https://img.shields.io/travis/jchartrand/CWRC-GitServer.svg)](https://travis-ci.org/jchartrand/CWRC-GitServer)
[![Codecov](https://img.shields.io/codecov/c/github/jchartrand/CWRC-GitServer.svg)](https://codecov.io/gh/jchartrand/CWRC-GitServer)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges) 

## Table of Contents

1. [Overview](#overview)
1. [API](#api)
1. [Demo](#demo)
1. [Setup](#setup)
1. [Development](#development)
    2. [Setup](#install)
    2. [Development Server](#development-server)
    2. [Testing](#testing)
    2. [Coverage](#coverage)
    2. [Commitizen](#commitizen)
    2. [Travis](#travis)
    2. [Git Hooks](#git-hooks)



### Overview

The CWRC-GitServer is a node.js express server acting as a proxy between [CWRC-GitDelegator](https://github.com/cwrc/CWRC-GithubServer) running in an instance of [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) (which is itelf an instance of [CWRC-Writer](https://github.com/cwrc/CWRC-Writer)) and the Github API.

CWRC-GitServer provides http enpoints for listing, creating, and updating CWRC XML documents, along with RDF annotations of the XML document.

The CWRC-GitServer in turn invokes [CWRC-Git](https://github.com/cwrc/CWRC-Git) which makes the calls to GitHub.

### API

The following http calls are supported:

`authenticate`

redirects user to the GitHub Oauth URI

`callback`

the callback given to Github, to which Github returns the user after successful OAuth authentication

`GET github/users`

returns information about the authenticated github user  

`GET github/{username}/repos`

returns a list of repositories for the given github username

`GET github/user/repos`

returns a list of repositories for the authenticated github user

`GET repos/{username}/{repo}/doc`

returns the document with the annotations bundled into the xml header

`POST /user/repos'

creates a new github repository and saves the posted XML document.  If the XML document has annotations in the header, the annotations are saved to individual files in an 'annotations' directory in the new repository.  A timestamp is used to create a tag for the repository so that all files can be accessed by a URI with timestamp (a Linked Data URI), allowing the document and all annotations to be effectively 'bundled' into versions.  

`PUT github/repos/{username}/{repoName}/doc`

saves the posted xml document and annotations to the repository.  As with the POST, all annotations are saved individually, the repo is tagged with a timestamp, and all files are referenced by their Linked Data URI, i.e., the tagged Github URI for each file.


### Demo

The [CWRC GitHub Sandbox](http://208.75.74.217/editor_github.html) uses the NPM package published from this repository along with the code in [CWRC-Git](https://github.com/cwrc/CWRC-Git), [CWRC-Writer](https://github.com/cwrc/CWRC-Writer),[CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter), and [CWRC-GitDelegator](https://github.com/cwrc/CWRC-GitServer). The same code is easily (for someone with modest development experience) installed on any server to run your own instance.

You can find a longer explanation of how all the parts coordinate in the [CWRC-GitWriter README](https://github.com/jchartrand/CWRC-GitWriter/blob/master/README.md)

### Setup

These are the steps we've used to install the [sandbox version of the CWRC-Writer](http://208.75.74.217/editor_github.html):

Install node.js on a server (one approach for ubuntu is described here:  https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Clone this repository to the server, or copy the files to the server.
Add to config.js the server address, the folder on the server into which the app should be installed (e.g., ~/cwrcserver), and the username with which to connect via ssh to the server.

On the server switch into the cwrc server directory and run:

`npm install` (to install the npm packages on the server)

Install pm2 to run express as a service:

```
sudo npm install pm2 -g
cd ~/cwrcserver
pm2 start ./bin/www
```

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

You will also have to install the [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) code on the server, as explained in its README.

### Development

#### Setup

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


