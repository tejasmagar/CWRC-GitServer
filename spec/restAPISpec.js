let nock = require("nock");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let config = require('../config');
let fixtures = require('../fixturesAndMocks/fixtures.js');
let mocks = require('../fixturesAndMocks/mocks.js');
let server = require('../app.js');

chai.use(chaiHttp);

// uncomment the line below to let calls through to Github, and have nock output the results
// to the console, for use in nock.  I've put past nock recordings in /fixturesAndMocks/mocks.js,
//  which nock now returns for calls to GitHub that it intercepts (by virtue of 'requiring' nock
// above.)  See https://github.com/node-nock/nock for full details.
   //  nock.recorder.rec();

describe("CWRCWriter Server Side API", function() {

  // get doc
   describe("GET github/repos/${fixtures.owner}/${fixtures.testRepo}/doc", function() {

    beforeEach(function() {
      var getDocumentFromGithubNock = mocks.getDocumentFromGithubNock();
      var getAnnotationsFromGithubNock = mocks.getAnnotationsFromGithubNock();
      var getBranchInfoFromGithubNock = mocks.getBranchInfoFromGithubNock();            
    });

    it("returns status code 200", function(done) {
       chai.request(server)
            .get(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/doc`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
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
              res.body[0].owner.login.should.eq(fixtures.owner);
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
              res.body[0].name.should.eq(fixtures.testRepo);
              done();
            });
    });
  });

   // create new doc/repo
   describe("POST /user/repos", function() {
    
    let data =
          {
          repo: fixtures.testRepo,
          isPrivate: fixtures.isPrivate, 
          doc:fixtures.testDoc, 
          description: fixtures.testRepoDescription,
          annotations: fixtures.annotationBundleText,
          versionTimestamp: fixtures.versionTimestamp
        };

    beforeEach(function() {
      var createGithubRepoNock = mocks.getCreateGithubRepoNock();
      var getMasterBranchFromGithubNock = mocks.getMasterBranchFromGithubNock();    
      var createGithubTreeNock = mocks.getGithubTreeNock();
      var createGithubCommitNock = mocks.getGithubCommitNock();
     // var createGithubCWRCBranchNock = mocks.getCreateGithubCWRCBranchNock();
      var updateGithubCWRCBranchNock = mocks.getUpdateGithubCWRCBranchNock();
      var createGithubTagNock = mocks.getCreateGithubTagNock();

      var getDocumentFromGithubNock = mocks.getDocumentFromGithubNock();
      var getAnnotationsFromGithubNock = mocks.getAnnotationsFromGithubNock();
      var getBranchInfoFromGithubNock = mocks.getBranchInfoFromGithubNock();  
    });

    it("returns correctly", function (done) {
        chai.request(server)
            .post(`/github/user/repos`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.doc.should.eq(fixtures.testDoc);
                res.body.annotations.should.eq(fixtures.annotationBundleText);
                res.body.owner.should.eq(fixtures.owner);
                res.body.repo.should.eq(fixtures.testRepo);
                res.body.baseTreeSHA.should.be.defined
                res.body.parentCommitSHA.should.be.defined;
              done();
            });
    });

  });

   // save doc
  describe("PUT github/repos/${fixtures.owner}/${fixtures.testRepo}/doc", function() {

    let data = {
      owner: fixtures.owner, 
      repo: fixtures.testRepo,
      doc: fixtures.testDoc, 
      annotations: fixtures.annotationBundleText,
      versionTimestamp: fixtures.versionTimestamp,
      baseTreeSHA: fixtures.baseTreeSHA,
      parentCommitSHA: fixtures.parentCommitSHA
    }

    beforeEach(function() {
      var createGithubTreeNock = mocks.getGithubTreeNock();
      var createGithubCommitNock = mocks.getGithubCommitNock();
      var updateGithubCWRCBranchNock = mocks.getUpdateGithubCWRCBranchNock();
      var createGithubTagNock = mocks.getCreateGithubTagNock();  

      var getDocumentFromGithubNock = mocks.getDocumentFromGithubNock();
      var getAnnotationsFromGithubNock = mocks.getAnnotationsFromGithubNock();
      var getBranchInfoFromGithubNock = mocks.getBranchInfoFromGithubNock();   
    });

    it("returns correctly", function(done) {

      chai.request(server)
            .put(`/github/repos/${fixtures.owner}/${fixtures.testRepo}/doc`)
            .set('cwrc-token', fixtures.cwrcJWTTokenContainingGithubOathToken)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.newTreeSHA.should.be.defined
                res.body.newCommitSHA.should.be.defined;
              done();
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
              res.body.login.should.eq(fixtures.owner);
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
              console.log(err);
              console.log(res);
              res.should.have.status(200);
              res.body.total_count.should.eq(1);
              done();
            });
    });
  });



  });
});
