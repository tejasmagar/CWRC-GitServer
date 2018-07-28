let nock = require("nock");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let config = require('../config');
let fixtures = require('../fixturesAndMocks/fixtures.js');
let mocks = require('../fixturesAndMocks/mocks.js');
let server = require('../app.js');
let repoFullMocks = require('../fixturesAndMocks/repoFullMocks.js')
let prMocks = require('../fixturesAndMocks/prMocks.js')
chai.use(chaiHttp);

// uncomment the line below to let calls through to Github, and have nock output the results
// to the console, for use in nock.  I've put past nock recordings in /fixturesAndMocks/mocks.js,
//  which nock now returns for calls to GitHub that it intercepts (by virtue of 'requiring' nock
// above.)  See https://github.com/node-nock/nock for full details.
    // nock.recorder.rec();

describe("CWRCWriter Server Side API", function() {

        // get repo contents using Github recursive option
    describe("GET '/repos/:owner/:repo", function() {
	    beforeEach(function () {
		     mocks.getRepoGetTree()
            mocks.masterBranchSHAs()
	    });

	    it("returns status code 200", function (done) {
		    chai.request(server)
			    .get(`/github/repos/${fixtures.owner}/${fixtures.testRepo}`)
			    .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
			    .end((err, res) => {
				    res.should.have.status(200);
				    //res.should.be.defined;
				    done();
			    });
	    });
    });
    // get repo contents by 'manually' drilling down through subdirs
    describe(" GET github/repos/:owner/:repo/full", function() {
	    beforeEach(function() {
		   repoFullMocks()
	    });

	    xit("returns status code 200", function(done) {
		    chai.request(server)
			    .get(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/full`)
			    .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
			    .end((err, res) => {
			    	console.log('test full repo')
			    	console.log(err)
				    console.log(res)
				    res.should.have.status(200);
				    //res.should.be.defined;
				    done();
			    });
	    });
    })

  // get doc
   describe("GET github/repos/${fixtures.owner}/${fixtures.testRepo}/contents", function() {

    beforeEach(function() {
        mocks.getDoc()
    });

    it("returns status code 200", function(done) {
       chai.request(server)
            .get(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/contents`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
           .query({branch: 'jchartrand', path: "curt/qurt/test.txt"})
            .end((err, res) => {
              res.should.have.status(200);
              //res.should.be.defined;
              done();
            });
    });
  });

   // get repos for given user
   describe("GET github/${fixtures.owner}/repos", function() {

    beforeEach(function() {
      var getReposForGithubUserNock = mocks.getReposForGithubUserNock();
    });

    it("returns correctly", function(done) {
       chai.request(server)
            .get(`/github/users/${fixtures.owner}/repos`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data[0].owner.login.should.eq(fixtures.owner);
              done();
            });
    });
  });

   // get repos for authenticated user
   describe("GET github/user/repos", function() {
  
    beforeEach(function() {
      var getReposForAuthenticatedUserNock = mocks.getReposForAuthenticatedUserNock();
    });

     it("returns correctly", function(done) {
       chai.request(server)
            .get(`/github/user/repos`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data[0].name.should.eq(fixtures.testRepo);
              done();
            });
    });
  });

   // create new repo
   describe("POST /user/repos", function() {
    
    let data =
          {
          repo: fixtures.testRepo,
          isPrivate: fixtures.isPrivate,
          description: fixtures.testRepoDescription
        };

    beforeEach(function() {
      mocks.getCreateGithubRepoNock();
    });

    it("returns correctly", function (done) {
        chai.request(server)
            .post(`/github/user/repos`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.owner.should.eq(fixtures.owner);
                res.body.repo.should.eq(fixtures.testRepo);
              done();
            });
    });

  });
	//nock.recorder.rec();
   // save doc
  describe("PUT github/repos/${fixtures.owner}/${fixtures.testRepo}/doc", function() {

	  let data = {
		  owner: fixtures.owner,
		  repo: fixtures.testRepo,
		  content: fixtures.testDoc,
		  message: 'some commit message',
		  branch: 'jchartrand',
		  path: 'curt/qurt/test.txt'
	  }

	  beforeEach(function () {
		  mocks.saveDocExistingSHA()
		  mocks.saveDoc()
	  });

	  it("returns correctly", function (done) {

		  chai.request(server)
			  .put(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/doc`)
			  .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
			  .send(data)
			  .end((err, res) => {
				  res.should.have.status(200);
				  res.body.sha.should.be.defined
				  done();
			  });
	  });
  })

	 // nock.recorder.rec();
	  // save doc in branch and issue pull request
	  describe("PUT github/repos/${fixtures.owner}/${fixtures.testRepo}/pr", function() {

		  let data = {
			  owner: fixtures.owner,
			  repo: fixtures.testRepo,
			  content: fixtures.testDoc,
			  message: 'some commit message',
			  title: 'a title for the pull request',
			  branch: 'jchartrand',
			  path: 'curt/qurt/test.txt'
		  }

		  beforeEach(function () {
			  prMocks()
		  });

		  it("returns correctly", function (done) {

			  chai.request(server)
				  .put(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/pr`)
				  .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
				  .send(data)
				  .end((err, res) => {
					  res.should.have.status(200);
					  res.body.sha.should.be.defined
					  done();
				  });
		  });
	  });
    // get details for authenticated user
  describe("GET github/users", function() {

    beforeEach(function() {
      var getDetailsForAuthenticatedUserNock = mocks.getDetailsForAuthenticatedUserNock();
    });

    it("returns correctly", function(done) {
       chai.request(server)
            .get(`/github/users`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.login.should.eq(fixtures.owner);
              done();
            });
    });
  });

    // search
  describe("GET github/search", function() {

    beforeEach(function() {
      var getSearchNock = mocks.getSearchNock();
    });

    it("returns correctly", function(done) {
       chai.request(server)
            .get(`/github/search`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .query({q: 'cwrc-melbourne+repo:jchartrand/cleanDoc2'}) 
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.total_count.should.eq(1);
              done();
            });
    });
  });

});
