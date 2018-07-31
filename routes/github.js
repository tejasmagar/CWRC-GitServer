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
        	if (error.code === 404) {
		        response.status(404).send('Not Found')
	        } else {
		        console.error("oh no!");
		        console.log(error);
		        debug(error);
		        response.status(500).send(`It broke! The error: ${error}`);
	        }
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

function getGithubClientId(req) {
	return config.github_client_id
}

function getGithubOauthCallback(req) {
	return config.github_oath_callback
}

function getGithubClientSecret(req) {
 return config.github_client_secret
}

// call that redirects to github for oauth 
router.get('/authenticate', function(req, res, next) {
	var githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${getGithubClientId(req)}&scope=repo&redirect_uri=${getGithubOauthCallback(req)}`;
	res.redirect(githubAuthURL);
});

// uri that github redirects back to after user has authenticated at github
router.get('/callback', function(req, res, next) {
	if (!req.query.code) {
    	// do something here, although this shouldn't ever be the case.
  	} else {

    	var code = req.query.code;
    	var params = '?code=' + code
                  + '&client_id=' + getGithubClientId(req)
                  + '&client_secret=' + getGithubClientSecret(req)

    	var uri = 'https://github.com/login/oauth/access_token'+params;

    	request.post(uri, function(err, resp, body) {
      		if (err) {
      			res.send(err.message);
		    } else {
		    	var githubOauthToken = (qs.parse(body)).access_token;
		        cwrcGit.authenticate(githubOauthToken);
		        var jwtToken = jwt.sign(githubOauthToken, config.jwt_secret);
				res.cookie('cwrc-token', jwtToken);
			    res.redirect('/');
		    }
    	})
  	} 
  	 
});

// get doc
router.get('/repos/:owner/:repo/contents', function({params: {owner, repo}, query: {branch, path}}, res, next) {
	res.handlePromise(cwrcGit.getDoc({owner, repo, branch, path}))
});

// create repo
router.post('/user/repos', function({body}, res, next) {
	if (!body.repo) {
		res.status(422).send('You need at least a name for your document!')
	} else {
		res.handlePromise(cwrcGit.createRepo(body))
	}
});

// save doc
router.put('/repos/:owner/:repo/doc', function({params: {owner, repo}, body}, res, next) {
	res.handlePromise(cwrcGit.saveDoc({...body, owner, repo}));
});

// save doc in branch and create pull request
router.put('/repos/:owner/:repo/pr', function({params: {owner, repo}, body}, res, next) {
	res.handlePromise(cwrcGit.saveAsPullRequest({...body, owner, repo}));
});

// get details for authenticated user
router.get('/users', function(req, res, next) {
	res.handlePromise(cwrcGit.getDetailsForAuthenticatedUser())
});

// get repos for authenticated user
router.get('/user/repos', function({query: {page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.getReposForAuthenticatedUser({page, per_page}))
});

// get repos for given user
router.get('/users/:username/repos', function({params: {username}, query: {page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.getReposForUser({username, page, per_page}))
});

// get structure for repo, using github recursive option
router.get('/repos/:owner/:repo', function({params: {owner, repo}}, res, next) {
	res.handlePromise(cwrcGit.getRepoContents({owner, repo}));
});

// get structure for repo, by manually recursing through subdirs,
// intended to be used if the github recursive option didn't work
// because the repository is too big
router.get('/repos/:owner/:repo/full', function({params: {owner, repo}}, res, next) {
	res.handlePromise(cwrcGit.getRepoContentsByDrillDown({owner, repo}));
});

// get templates
router.get('/templates', function(req, res, next) {
	res.handlePromise(cwrcGit.getTemplates({}))
});

// get template
router.get('/templates/:template', function({params: {template}}, res, next) {
	res.handlePromise(cwrcGit.getTemplate({path: template}))
});

// do search
router.get('/search', function({query: {q, page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.search(q, page, per_page))
});

module.exports = router;
