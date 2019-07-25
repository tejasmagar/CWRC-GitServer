/**
 * Module providing GitHub related routes.
 * @module routes/github
 */

var express = require('express');
/**
 * Express router to mount GitHub related functions on.
 * @namespace router
 */
var router = express.Router();
var request = require('request')
var debug = require('debug')('cwrc-server:server');
var qs = require('querystring');
var cwrcGit = require('cwrcgit');

/**
 * The CWRC-GitServer config object, located at {@link https://github.com/cwrc/CWRC-GitServer/blob/master/config.js}.
 * @namespace
 * @property {Boolean} github_client_cors Is the GitHub client located at a different origin than this server?
 * @property {String} github_client_origin The GitHub client origin, if different than this server
 * @property {String} github_client_id The OAuth ID
 * @property {String} github_client_secret The OAuth secret
 * @property {String} github_oath_callback The location of this server's callback route
 * @property {String} github_oath_callback_redirect The location of the CWRC-GitWriter instance
 * @property {String} templates_owner The templates repo owner
 * @property {String} templates_repo The templates repo name
 * @property {String} templates_ref The templates repo ref
 * @property {String} templates_path The templates repo path
 * @property {String} personal_oath_for_testing OAuth ID to use for running tests
 * @property {String} jwt_secret_for_testing JWT secret to use for running tests
 */
var config = require('../config.js');

function isGithubClientCORS() {
	return config.github_client_cors
}
function getGithubClientOrigin() {
	return config.github_client_origin
}
function getGithubClientId() {
	return config.github_client_id
}
function getGithubOauthCallback() {
	return config.github_oath_callback
}
function getGithubClientSecret() {
	return config.github_client_secret
}
function getAuthenticationCallbackRedirect() {
	return config.github_oath_callback_redirect
}

function getTemplatesOwner() {
	return config.templates_owner
}
function getTemplatesRepo() {
	return config.templates_repo
}
function getTemplatesRef() {
	return config.templates_ref
}
function getTemplatesPath() {
	return config.templates_path
}

/**
 * Custom middleware to add standard error handling, based on promises, to routes
 * that use promises, i.e. the routes that make calls to the GitHub API.
 * Also sets Access-Control-Allow headers in the response, if isGithubClientCORS returns true.
 * @module handleResponsePromise
 * @function
 * @param {Object} req The request
 * @param {Object} res The response
 * @param {Function} next Next middleware function
 */
function handleResponsePromise(request, response, next) {
	if (isGithubClientCORS()) {
		response.header('Access-Control-Allow-Origin', getGithubClientOrigin());
		response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
		response.header('Access-Control-Allow-Headers', 'cwrc-token, Content-Type');
		response.header('Access-Control-Allow-Credentials', 'true');
	}

    response.handlePromise = function(promise) {
        promise.then(function(result) {
            response.send(result);
        }).catch(function(error) {
        	if (error.code === 404) {
				response.status(404).send('Not Found')
	        } else {
		        console.log('Server error:', error);
		        debug(error);
		        response.status(500).send(error);
	        }
        });
    }
    next();
}
router.use(handleResponsePromise);

/**
 * Custom middleware to authenticate with GitHub if a cwrc-token is in the header.
 * The cwrc-token contains the GitHub OAuth token.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#authenticate}
 * @module handleAuthentication
 * @function
 * @param {Object} req The request
 * @param {Object} res The response
 * @param {Function} next Next middleware function
 */
function handleAuthentication(req,res,next) {

    const githubToken = req.headers['cwrc-token'];
    if (githubToken) {
	    cwrcGit.authenticate(githubToken);
	    req.githubAuthenticated = true;
	    next();
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

/**
 * Route that redirects to GitHub in order to use OAuth.
 * @name get/authenticate
 * @function
 * @memberof module:routes/github~router
 */
router.get('/authenticate', function(req, res, next) {
	var githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${getGithubClientId()}&scope=repo&redirect_uri=${getGithubOauthCallback()}`;
	res.redirect(githubAuthURL);
});

/**
 * Route that GitHub redirects back to after the user has authenticated at GitHub.
 * Sets the cwrc-token cookie, used to make authenticated calls.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#authenticate}
 * @name get/callback
 * @function
 * @memberof module:routes/github~router
 */
router.get('/callback', function(req, res, next) {
	if (!req.query.code) {
    	// do something here, although this shouldn't ever be the case.
  	} else {

    	var code = req.query.code;
    	var params = '?code=' + code
                  + '&client_id=' + getGithubClientId()
                  + '&client_secret=' + getGithubClientSecret()

    	var uri = 'https://github.com/login/oauth/access_token'+params;

    	request.post(uri, function(err, resp, body) {
      		if (err) {
      			res.send(err.message);
		    } else {
		    	var githubOauthToken = (qs.parse(body)).access_token;
		        cwrcGit.authenticate(githubOauthToken);
		        res.cookie('cwrc-token', githubOauthToken);
			    res.redirect(getAuthenticationCallbackRedirect());
		    }
    	})
  	} 
  	 
});

/**
 * Get a document from GitHub.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getDoc}
 * @name get/repos/:owner/:repo/contents
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 * @param {String} req.query.branch The repo branch
 * @param {String} req.query.path The document path
 */
router.get('/repos/:owner/:repo/contents', function({params: {owner, repo}, query: {branch, path}}, res, next) {
	res.handlePromise(cwrcGit.getDoc(owner, repo, branch, path))
});

/**
 * Create a repo in the authenticated user's account.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#createRepo}
 * @name post/user/repos
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.body.repo The repo name
 * @param {String} req.body.description The repo description
 * @param {Boolean} [req.body.isPrivate=false] Is the repo private?
 */
router.post('/user/repos', function({body}, res, next) {
	var {repo, description, isPrivate = false} = body;
	if (!repo) {
		res.status(422).send('You need at least a name for your document!')
	} else {
		res.handlePromise(cwrcGit.createRepo(repo, description, isPrivate))
	}
});

/**
 * Save a document.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#saveDoc}
 * @name put/repos/:owner/:repo/doc
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 * @param {String} req.body.path The document path
 * @param {String} req.body.content The document content
 * @param {String} req.body.branch The repo branch
 * @param {String} req.body.message The commit message
 * @param {String} [req.body.sha] The commit SHA
 */
router.put('/repos/:owner/:repo/doc', function({params: {owner, repo}, body}, res, next) {
	var {path, content, branch, message, sha} = body;
	res.handlePromise(cwrcGit.saveDoc(owner, repo, path, content, branch, message, sha));
});

/**
 * Save a document as a pull request.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#saveAsPullRequest}
 * @name put/repos/:owner/:repo/pr
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 * @param {String} req.body.path The document path
 * @param {String} req.body.content The document content
 * @param {String} req.body.branch The repo branch
 * @param {String} req.body.message The commit message
 * @param {String} req.body.title The pull request title
 * @param {String} [req.body.sha] The commit SHA
 */
router.put('/repos/:owner/:repo/pr', function({params: {owner, repo}, body}, res, next) {
	var {path, content, branch, message, title, sha} = body;
	res.handlePromise(cwrcGit.saveAsPullRequest(owner, repo, path, content, branch, message, title, sha));
});

/**
 * Get details for a user.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getDetailsForUser}
 * @name get/users/:username
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.username The username
 */
router.get('/users/:username', function({params: {username}}, res, next) {
	res.handlePromise(cwrcGit.getDetailsForUser(username))
});

/**
 * Get details for the authenticated user.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getDetailsForAuthenticatedUser}
 * @name get/users
 * @function
 * @memberof module:routes/github~router
 */
router.get('/users', function(req, res, next) {
	res.handlePromise(cwrcGit.getDetailsForAuthenticatedUser())
});

/**
 * Get the repos for the authenticated user.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getReposForAuthenticatedUser}
 * @name get/user/repos
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} [req.query.affiliation=owner] The user's affiliation to the repo
 * @param {Integer} [req.query.page=1] The results page to get
 * @param {Integer} [req.query.per_page=10] The number of results per page
 */
router.get('/user/repos', function({query: {page=1, per_page=10, affiliation='owner'}}, res, next) {
	res.handlePromise(cwrcGit.getReposForAuthenticatedUser(affiliation, page, per_page))
});

/**
 * Get the repos for a user.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getReposForUser}
 * @name get/users/:username/repos
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.username The username
 * @param {Integer} [req.query.page=1] The results page to get
 * @param {Integer} [req.query.per_page=10] The number of results per page
 */
router.get('/users/:username/repos', function({params: {username}, query: {page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.getReposForUser(username, page, per_page))
});

/**
 * Get permissions for a given user and repo.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getPermissionsForUser}
 * @name get/repos/:owner/:repo/collaborators/:username/permission
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 * @param {String} req.params.username The username
 */
router.get('/repos/:owner/:repo/collaborators/:username/permission', function({params: {owner, repo, username}}, res, next) {
	res.handlePromise(cwrcGit.getPermissionsForUser(owner, repo, username))
});

/**
 * Get the structure for a repo, using GitHub recursive option.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getRepoContents}
 * @name get/repos/:owner/:repo
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 */
router.get('/repos/:owner/:repo', function({params: {owner, repo}}, res, next) {
	res.handlePromise(cwrcGit.getRepoContents(owner, repo));
});

/**
 * Get the structure for a repo, by manually recursing through subdirectories.
 * Intended to be used if the GitHub recursive option didn't work because the repository is too big.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getRepoContentsByDrillDown}
 * @name get/repos/:owner/:repo/full
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.owner The repo owner
 * @param {String} req.params.repo The repo name
 */
router.get('/repos/:owner/:repo/full', function({params: {owner, repo}}, res, next) {
	res.handlePromise(cwrcGit.getRepoContentsByDrillDown(owner, repo));
});

/**
 * Get the details for an organization.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getDetailsForOrg}
 * @name get/orgs/:org
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.org The organization
 */
router.get('/orgs/:org', function({params: {org}}, res, next) {
	res.handlePromise(cwrcGit.getDetailsForOrg(org));
});

/**
 * Create a repo for a given organization.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#createOrgRepo}
 * @name post/orgs/:org/repos
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.params.org The organization
 * @param {String} req.body.repo The repo name
 * @param {String} req.body.description The repo description
 * @param {Boolean} [req.body.isPrivate=false] Is the repo private?
 */
router.post('/orgs/:org/repos', function({params: {org}, body}, res, next) {
	var {repo, description, isPrivate = false} = body;
	if (!repo) {
		res.status(422).send('You need at least a name for your document!')
	} else {
		res.handlePromise(cwrcGit.createOrgRepo(org, repo, description, isPrivate))
	}
});


/**
 * Get the CWRC-Writer templates.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#getTemplates}
 * @name get/templates
 * @function
 * @memberof module:routes/github~router
 */
router.get('/templates', function(req, res, next) {
	var owner = getTemplatesOwner();
	var repo = getTemplatesRepo();
	var ref = getTemplatesRef();
	var path = getTemplatesPath();
	res.handlePromise(cwrcGit.getTemplates(owner, repo, ref, path))
});


/**
 * Perform a code search.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#searchCode}
 * @name get/search/code
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.query.q The search query
 * @param {Integer} [req.query.page=1] The results page to get
 * @param {Integer} [req.query.per_page=10] The number of results per page
 */
router.get('/search/code', function({query: {q, page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.searchCode(q, page, per_page))
});

/**
 * Perform a repos search.
 * Calls {@link https://github.com/cwrc/CWRC-Git/blob/master/API.md#searchRepos}
 * @name get/search/repositories
 * @function
 * @memberof module:routes/github~router
 * @param {Object} req The request
 * @param {String} req.query.q The search query
 * @param {Integer} [req.query.page=1] The results page to get
 * @param {Integer} [req.query.per_page=10] The number of results per page
 */
router.get('/search/repositories', function({query: {q, page=1, per_page=10}}, res, next) {
	res.handlePromise(cwrcGit.searchRepos(q, page, per_page))
});

module.exports = router;
