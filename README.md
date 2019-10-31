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

Install pm2 to run Express.js as a service:

```
sudo npm install pm2 -g
cd ~/cwrcserver
pm2 start ./bin/www
```

#### OAuth

Next you'll need to [create an OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) so that CWRC-GitServer can access GitHub on behalf of the user.

#### Config

Once you have the client ID and client secret for your OAuth app, you'll need to edit the [config.js file](https://github.com/cwrc/CWRC-GitServer/blob/master/config.js). The following fields need to customized:

**github_client_cors**

Set to `true` if CWRC-GitServer is at a different origin than CWRC-GitWriter.

**github_client_origin**

The origin for CWRC-GitWriter (used if `github_client_cors` is true).

**github_client_id**

The client ID for your OAuth app.

**github_client_secret**

The client secret for your OAuth app.

**github_oath_callback**

The URL that GitHub should redirect to, after the user authorizes the OAuth app. It should lead to the `github/callback` route as seen [here](https://github.com/cwrc/CWRC-GitServer/blob/master/routes/github.js#L150).

**github_oath_callback_redirect**

The URL that CWRC-GitServer should redirect to, after handling the OAuth callback. It should lead to your installation of CWRC-GitWriter.


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

### CWRC-GitWriter

You will also have to install the [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) code on the server, as explained in its README.

