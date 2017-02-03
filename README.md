![Picture](http://www.cwrc.ca/wp-content/uploads/2010/12/CWRC_Dec-2-10_smaller.png)

# CWRC-GitServer

## Table of Contents

1. [Overview](#overview)
1. [Demo](#demo)
1. [Setup](#setup)
1. [Development](#development)
    2. [Install](#install)
    2. [Development Server](#development-server)
    2. [Testing](#testing)
1. [Contributing](#contributing)
1. [FAQ](#faq)
1. [License](#license)


### Overview

The CWRC-GitServer is a node.js express server acting as a proxy between [CWRC-GitDelegator](https://github.com/cwrc/CWRC-GithubServer) running in an instance of [CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter) (which is itelf an instance of [CWRC-Writer](https://github.com/cwrc/CWRC-Writer)) and the Github API.

CWRC-GitServer provides http enpoints for listing, creating, and updating CWRC XML documents, along with RDF annotations of the XML document.

The CWRC-GitServer in turn invokes [CWRC-Git](https://github.com/cwrc/CWRC-Git) which makes the calls to GitHub.

### Demo

The [CWRC GitHub Sandbox](http://208.75.74.217/editor_github.html) uses the NPM package published from this repository along with the code in [CWRC-Git](https://github.com/cwrc/CWRC-Git), [CWRC-Writer](https://github.com/cwrc/CWRC-Writer),[CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter), and [CWRC-GitDelegator](https://github.com/cwrc/CWRC-GitServer). The same code is easily (for someone with modest development experience) installed on any server to run your own instance.

You can find an explanation of how all the parts coordinate in the [CWRC-GitWriter README](https://github.com/jchartrand/CWRC-GitWriter/blob/master/README.md)

### Setup

These are the steps we've used to install the [sandbox version of the CWRC-Writer](http://208.75.74.217/editor_github.html):

Install node.js on a server (one approach for ubuntu is described here:  https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Clone this repository to your development machine (laptop)
Add to config.js the server address, the folder on the server into which the app should be installed (e.g., ~/cwrcserver), and the username with which to connect via ssh to the server.

`npm install` (to install the npm packages locally on your dev machine)
`npm deploy` (to copy the code to the server)

On the server switch into the cwrc server directory and run:

`npm install` (to install the npm packages on the server)

Start the express server:

`DEBUG=cwrc-server:* npm start`

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

### Development

#### Install

#### Development Server

#### Testing

### Contributing

### FAQ

### License

[GNU GPL V2](LICENSE)
