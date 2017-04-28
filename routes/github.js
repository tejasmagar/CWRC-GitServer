var express = require('express');
var router = express.Router();
var request = require('request')
var debug = require('debug')('cwrc-server:server');

var jwt    = require('jsonwebtoken');
var qs = require('querystring');
var config = require('../config');
var cwrcGit = require('cwrcgit');


// custom middleware to add standard error handling, based on promises, to routes
// that use promises, i.e., the routes that make calls to the github api
function handleResponsePromise(request, response, next) {
    response.handlePromise = function(promise) {
        promise.then(function(result) {
            response.send(result);
        }).catch(function(error) {
            console.error("oh no!");
        	console.log(e);
        	debug(e);
        	res.status(500).send('It broke!');
        });
    }
    next();
}
router.use(handleResponsePromise);

// custom middleware to authenticate with github if a cwrc-token is in the header
// the cwrc-token contains the github oath token.
function handleAuthentication(req,res,next) {

    // the githubToken will, if present, be embedded in the jwt that is in the header, as above.
    var jwtToken = req.headers['cwrc-token'];
	if (jwtToken) {
		jwt.verify(jwtToken, config.jwt_secret, function(err, decodedGithHubToken) {
			if (err) {
		        //return res.json({ success: false, message: 'Failed to authenticate token.' });   
		        next(); 
		    } else {
		        cwrcGit.authenticate(decodedGithHubToken);
		        req.githubAuthenticated = true;
				next();
		    }
		});
	} else {
		req.githubAuthenticated = false;
		next();
	}
	/*the above could be used later in certain routes like so:
	if(!req.githubAuthenticated) {
        return res.redirect('/login');
    }
    */
}
router.use(handleAuthentication);
	
// call that redirects to github for oauth 
router.get('/authenticate', function(req, res, next) {
	var githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${config.github_client_id}&scope=repo&redirect_uri=${config.github_oath_callback}`;
	res.redirect(githubAuthURL);
});

// uri that github redirects back to after user has authenticated at github
router.get('/callback', function(req, res, next) {
	if (!req.query.code) {
    	// do something here, although this shouldn't ever be the case.
  	} else {
    	var code = req.query.code;
    	var params = '?code=' + code
                  + '&client_id=' + config.github_client_id
                  + '&client_secret=' + config.github_client_secret;

    	var uri = 'https://github.com/login/oauth/access_token'+params;

    	request.post(uri, function(err, resp, body) {
      		if (err) {
      			res.send(err.message);
		    } else {
		    	var githubOauthToken = (qs.parse(body)).access_token;
		        cwrcGit.authenticate(githubOauthToken);
		        var jwtToken = jwt.sign(githubOauthToken, config.jwt_secret);
				res.cookie('cwrc-token', jwtToken);
			    res.redirect('/index.html');
		    }
    	})
  	} 
  	 
});

/*
router.get('/repositories/:repoid', function(req, res, next) {
	res.handlePromise(cwrcGit.getRepoById({id: req.params.repoid}))
});
*/

// get doc
router.get('/repos/:owner/:repo/doc', function(req, res, next) {
	res.handlePromise(cwrcGit.getDoc({owner: req.params.owner, repo: req.params.repo}))
});

// create repo
router.post('/user/repos', function(req, res, next) {
	//console.log(req.body);
	if (!req.body.repo) {
		res.status(422).send('You need at least a name for your document!')
	} else if (!req.body.doc) {
		res.status(422).send('You need a document!')
	} else {
		res.handlePromise(cwrcGit.createRepoForDoc(req.body))
	}
});

// save doc
router.put('/repos/:owner/:repo/doc', function(req, res, next) {
	// add the owner and repo to the object already in the body, then
	// call the cwrc function to save the doc.
	req.body.owner = req.params.owner;
	req.body.repo = req.params.repo;
	res.handlePromise(cwrcGit.saveDoc(req.body));
});

// get details for authenticated user
router.get('/users', function(req, res, next) {
	res.handlePromise(cwrcGit.getDetailsForAuthenticatedUser())
});

// get repos for authenticated user
router.get('/user/repos', function(req, res, next) {
	res.handlePromise(cwrcGit.getReposForAuthenticatedUser())
});

// get repos for given user
router.get('/users/:username/repos', function(req, res, next) {
	var githubUserName = req.params.username;
	res.handlePromise(cwrcGit.getReposForUser({username:githubUserName}))
});

// get templates
router.get('/templates', function(req, res, next) {
	res.handlePromise(cwrcGit.getTemplates({}))
});

// get template
router.get('/templates/:template', function(req, res, next) {
	var templateName = req.params.template
	res.handlePromise(cwrcGit.getTemplate({path:templateName}))
});

// get template
router.get('/search', function(req, res, next) {
	var query = req.query.q
	res.handlePromise(cwrcGit.search(query))
});


module.exports = router;
