var nock = require('nock');
var config = require('../config');
var fixtures = require('./fixtures.js');

// we use the cwrcAppName to match CWRC GitHub repositories that are themselves documemnts,
// but we don't match to match repositories that are code repositories,
// so here we sneakily concatenate the full string to avoid matches on this code repo.
var cwrcAppName = "CWRC-GitWriter" + "-web-app";

function getDetailsForAuthenticatedUserNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
    .get('/user')
    .query({"access_token":config.personal_oath_for_testing})
    .reply(200, {"login":fixtures.owner,"id":547165,"avatar_url":"https://avatars.githubusercontent.com/u/547165?v=3","gravatar_id":"","url":"https://api.github.com/users/jchartrand","html_url":"https://github.com/jchartrand","followers_url":"https://api.github.com/users/jchartrand/followers","following_url":"https://api.github.com/users/jchartrand/following{/other_user}","gists_url":"https://api.github.com/users/jchartrand/gists{/gist_id}","starred_url":"https://api.github.com/users/jchartrand/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jchartrand/subscriptions","organizations_url":"https://api.github.com/users/jchartrand/orgs","repos_url":"https://api.github.com/users/jchartrand/repos","events_url":"https://api.github.com/users/jchartrand/events{/privacy}","received_events_url":"https://api.github.com/users/jchartrand/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":null,"location":null,"email":null,"hireable":null,"bio":null,"public_repos":13,"public_gists":0,"followers":3,"following":1,"created_at":"2011-01-04T15:50:51Z","updated_at":"2017-01-31T21:24:53Z"});
}

function getReposForAuthenticatedUserNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
  .get('/user/repos')
  .query(true)
  .reply(200, [{"id":19289649,"name":fixtures.testRepo}]);

}

/*function getGithubTreeFailureNock() {
  // In this one, I only return what's needed for the test to continue, i.e., the newSHA
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/trees`, 
          {"tree":[
            {"path":"document.xml","mode":"100644","type":"blob","content":fixtures.testDoc},
            {"path":"annotations.json","mode":"100644","type":"blob","content":fixtures.annotationBundleText}
          ],
          "base_tree":fixtures.baseTreeSHA
        })
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"sha":fixtures.newTreeSHA});
}*/

/*
function  getGithubCommitNock() {
  // NOTE:  I put in more in the reply than necessary. I  put it in
      // to help explain what's going on.
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/commits`, {"message":fixtures.commitMessage,"tree":fixtures.newTreeSHA,"parents":[fixtures.parentCommitSHA]})
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {
            "sha": fixtures.newCommitSHA,
            "tree": {"sha": fixtures.newTreeSHA},
            "message": fixtures.commitMessage,
            "parents": [{"sha": fixtures.parentCommitSHA}]
        });
}*/

function  getGithubCommitNock() {
  // NOTE:  I put in more in the reply than necessary. I  put it in
      // to help explain what's going on.
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/commits`, function(body) {
          
          return (body.message === 'saving cwrc version'
          && body.tree === 'newTreeSHAForTesting'
          && body.parents[0] === 'parentCommitSHAForTesting')
          }
        ).query({"access_token":config.personal_oath_for_testing})
        .reply(201, {
            "sha": fixtures.newCommitSHA,
            "tree": {"sha": fixtures.newTreeSHA},
            "message": fixtures.commitMessage,
            "parents": [{"sha": fixtures.parentCommitSHA}]
        });
}

/*
function getCreateGithubCWRCBranchNock() {
   // NOTE:  I didn't really need to return anything in the reply.  It isn't used. I just put it in
      // to help explain what's going on.
      return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/refs`, {"ref":"refs/heads/cwrc-drafts","sha":fixtures.newCommitSHA})
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"ref": "refs/heads/cwrc-drafts","object": {"sha": fixtures.newCommitSHA}});

}*/

function getUpdateGithubCWRCBranchNock() {
    // this is exactly the same as the create one above, but uses patch instead of post.
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .patch(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/refs/heads/master`, {"sha":fixtures.newCommitSHA})
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"ref": "refs/heads/master","object": {"sha": fixtures.newCommitSHA}});
}

function getCreateGithubTagNock() {
      // NOTE:  I didn't really need to return anything in the reply.  It isn't used.  I just put it in
      // to help explain what's going on.
      return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/refs`, {"ref":`refs/tags/cwrc/${fixtures.versionTimestamp}`,"sha":fixtures.newCommitSHA})
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {
          "ref": `refs/tags/cwrc/${fixtures.versionTimestamp}`,
          "object": {"sha": fixtures.newCommitSHA}
        });
}


function getGithubTreeNock() {
  // In this one, I only return what's needed for the test to continue, i.e., the newSHA
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/trees`, 
          function(body) {
                  return (body.tree[0].path === 'document.xml' 
                  && body.tree[0].content.includes(`<encodingDesc><appInfo><application version="1.0" ident="${cwrcAppName}" notAfter="`)
                  && body.tree[1].path === 'annotations.json')

                }
          /*{"tree":[
            {"path":"document.xml","mode":"100644","type":"blob","content":fixtures.testDocWithTagAdded},
            {"path":"annotations.json","mode":"100644","type":"blob","content":fixtures.annotationBundleText}
          ],
          "base_tree":fixtures.baseTreeSHA
        }*/
        )
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"sha":fixtures.newTreeSHA});
}

/*
function getGithubTreeNock() {
  // In this one, I only return what's needed for the test to continue, i.e., the newSHA
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post(`/repos/${fixtures.owner}/${fixtures.testRepo}/git/trees`, 
          {"tree":[
            {"path":"document.xml","mode":"100644","type":"blob","content":fixtures.testDoc},
            {"path":"annotations.json","mode":"100644","type":"blob","content":fixtures.annotationBundleText}
          ],
          "base_tree":fixtures.baseTreeSHA
        })
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"sha":fixtures.newTreeSHA});
} */

function getCreateGithubRepoNock() {
// NOTE:  I put in more in the reply than necessary. I  put it in
      // to help explain what's going on.
      return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .post('/user/repos', {"name":fixtures.testRepo,"description":fixtures.testRepoDescription,"private":fixtures.isPrivate,"auto_init":true})
        .query({"access_token":config.personal_oath_for_testing})
        .reply(201, {"owner": {"login": fixtures.owner}, "name": fixtures.testRepo});
}

function getMasterBranchFromGithubNock() {
        // NOTE:  I put in more in the reply than necessary. I  put it in
      // to help explain what's going on.
      return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .get(`/repos/${fixtures.owner}/${fixtures.testRepo}/branches/master`)
        .query({"access_token":config.personal_oath_for_testing})
        .reply(200, { "commit": {
                        "sha": fixtures.parentCommitSHA,
                        "commit": {
                          "message": "test commit",
                          "tree": {
                            "sha": fixtures.baseTreeSHA
                          }
                        }
                      }
                    });
}

function getDocumentFromGithubNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .get(`/repos/${fixtures.owner}/${fixtures.testRepo}/contents/document.xml`)
        .query({"ref":"master", "access_token":config.personal_oath_for_testing})
        .reply(200, {content: fixtures.base64TestDoc});
}

function getAnnotationsFromGithubNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .get(`/repos/${fixtures.owner}/${fixtures.testRepo}/contents/annotations.json`)
        .query({"ref":"master", "access_token":config.personal_oath_for_testing})
        .reply(200, {content: fixtures.base64AnnotationBundle});
}

function getBranchInfoFromGithubNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .get(`/repos/${fixtures.owner}/${fixtures.testRepo}/branches/master`)
        .query({"access_token":config.personal_oath_for_testing})
        .reply(200, { "commit": {
                        "sha": "thid doesn't matter",
                        "commit": {
                          "message": "a fake commit message",
                          "tree": {
                            "sha": "someSHAorAnother"
                          }
                        }
                      }
                    })
}

function getReposForGithubUserNock() {

  return nock('https://api.github.com:443', {"encodedQueryParams":true})
        .get(`/users/${fixtures.owner}/repos`)
        .query(true)
        .reply(200, [{
          "id": 76067525,
          "name": "aTest",
          "full_name": fixtures.ownerAndRepo,
          "owner": {
            "login": fixtures.owner
          },
          "private": false,
          "description": "a description of the repo"
        }, {
          "id": 75946742,
          "name": "aTest",
          "full_name": fixtures.owner + '/someOtherRepo',
          "owner": {
            "login": fixtures.owner
          },
          "private": true,
          "default_branch": "master"
        }]);
}
    
    function getTemplateNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
  .get('/repos/cwrc/CWRC-Writer-Templates/contents/templates%2Fletter.xml')
  .query({"ref":"master","access_token":config.personal_oath_for_testing})
  .reply(200, {"name":"letter.xml","path":"templates/letter.xml","sha":"1525a783ddcd2844d75677d3748673d749c99963","size":4470,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/letter.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/letter.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/1525a783ddcd2844d75677d3748673d749c99963","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/letter.xml","type":"file","content":"77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPD94\nbWwtbW9kZWwgaHJlZj0iaHR0cDovL2N3cmMuY2Evc2NoZW1hcy9jd3JjX3Rl\naV9saXRlLnJuZyIgdHlwZT0iYXBwbGljYXRpb24veG1sIiBzY2hlbWF0eXBl\nbnM9Imh0dHA6Ly9yZWxheG5nLm9yZy9ucy9zdHJ1Y3R1cmUvMS4wIj8+Cjw/\neG1sLXN0eWxlc2hlZXQgdHlwZT0idGV4dC9jc3MiIGhyZWY9Imh0dHA6Ly9j\nd3JjLmNhL3RlbXBsYXRlcy9jc3MvdGVpLmNzcyI/Pgo8VEVJIHhtbG5zPSJo\ndHRwOi8vd3d3LnRlaS1jLm9yZy9ucy8xLjAiIHhtbG5zOnJkZj0iaHR0cDov\nL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6\nY3c9Imh0dHA6Ly9jd3JjLmNhL25zL2N3IyIgeG1sbnM6dz0iaHR0cDovL2N3\ncmN0Yy5hcnRzcm4udWFsYmVydGEuY2EvIyI+Cgk8cmRmOlJERiB4bWxuczpy\nZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1u\ncyMiIHhtbG5zOmN3PSJodHRwOi8vY3dyYy5jYS9ucy9jdyMiIHhtbG5zOm9h\nPSJodHRwOi8vd3d3LnczLm9yZy9ucy9vYSMiIHhtbG5zOmZvYWY9Imh0dHA6\nLy94bWxucy5jb20vZm9hZi8wLjEvIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJk\nZjphYm91dD0iaHR0cDovL2FwcHMudGVzdGluZy5jd3JjLmNhL2VkaXRvci9k\nb2N1bWVudHMvbnVsbCI+CgkJCTxjdzptb2RlPjA8L2N3Om1vZGU+CgkJPC9y\nZGY6RGVzY3JpcHRpb24+CgkJPHJkZjpEZXNjcmlwdGlvbiB4bWxuczpyZGY9\nImh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMi\nIHJkZjphYm91dD0iaHR0cDovL2lkLmN3cmMuY2EvYW5ub3RhdGlvbi8zM2Mz\nNzdmMS0yMWZhLTQ1OTQtOWIxZi05M2Q3ZTM4N2ZjOGEiPgoJCQk8b2E6aGFz\nVGFyZ2V0IHhtbG5zOm9hPSJodHRwOi8vd3d3LnczLm9yZy9ucy9vYSMiIHJk\nZjpyZXNvdXJjZT0iaHR0cDovL2lkLmN3cmMuY2EvdGFyZ2V0LzE2OGJhMzlk\nLTJiYjktNDY0ZC1iMzNhLTAxM2ZhNjMwZDJjMSIvPgoJCQk8b2E6aGFzQm9k\neSB4bWxuczpvYT0iaHR0cDovL3d3dy53My5vcmcvbnMvb2EjIiByZGY6cmVz\nb3VyY2U9Imh0dHA6Ly9jd3JjLWRldi0wMS5zcnYudWFsYmVydGEuY2EvaXNs\nYW5kb3JhL29iamVjdC83M2MzMzRkMy0yNjI5LTRmNjMtODM1Yi0yM2ZjMGE3\nMDZkN2MiLz4KCQkJPG9hOmFubm90YXRlZEJ5IHhtbG5zOm9hPSJodHRwOi8v\nd3d3LnczLm9yZy9ucy9vYSMiIHJkZjpyZXNvdXJjZT0iaHR0cDovL2lkLmN3\ncmMuY2EvdXNlci8wNmY5M2JjMy1kODNhLTQzMDAtYTIwOS0zY2YxMmNjNmE5\nZTkiLz4KCQkJPG9hOmFubm90YXRlZEF0IHhtbG5zOm9hPSJodHRwOi8vd3d3\nLnczLm9yZy9ucy9vYSMiPjIwMTQtMTAtMDFUMTY6MTI6MTMuNDY0Wjwvb2E6\nYW5ub3RhdGVkQXQ+CgkJCTxvYTpzZXJpYWxpemVkQnkgeG1sbnM6b2E9Imh0\ndHA6Ly93d3cudzMub3JnL25zL29hIyIgcmRmOnJlc291cmNlPSIiLz4KCQkJ\nPG9hOnNlcmlhbGl6ZWRBdCB4bWxuczpvYT0iaHR0cDovL3d3dy53My5vcmcv\nbnMvb2EjIj4yMDE0LTEwLTAxVDE2OjEyOjEzLjQ2NFo8L29hOnNlcmlhbGl6\nZWRBdD4KCQkJPHJkZjp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3d3dy53\nMy5vcmcvbnMvb2EjQW5ub3RhdGlvbiIvPgoJCQk8b2E6bW90aXZhdGVkQnkg\neG1sbnM6b2E9Imh0dHA6Ly93d3cudzMub3JnL25zL29hIyIgcmRmOnJlc291\ncmNlPSJodHRwOi8vd3d3LnczLm9yZy9ucy9vYSN0YWdnaW5nIi8+CgkJCTxv\nYTptb3RpdmF0ZWRCeSB4bWxuczpvYT0iaHR0cDovL3d3dy53My5vcmcvbnMv\nb2EjIiByZGY6cmVzb3VyY2U9Imh0dHA6Ly93d3cudzMub3JnL25zL29hI2lk\nZW50aWZ5aW5nIi8+CgkJCTxjdzpoYXNDZXJ0YWludHkgeG1sbnM6Y3c9Imh0\ndHA6Ly9jd3JjLmNhL25zL2N3IyIgcmRmOnJlc291cmNlPSJodHRwOi8vY3dy\nYy5jYS9ucy9jdyNkZWZpbml0ZSIvPgoJCQk8Y3c6Y3dyY0luZm8geG1sbnM6\nY3c9Imh0dHA6Ly9jd3JjLmNhL25zL2N3IyI+eyJpZCI6Imh0dHA6Ly92aWFm\nLm9yZy92aWFmLzM5NTY5NzUyIiwibmFtZSI6IkJyb3duLCBNaXF1ZWwiLCJy\nZXBvc2l0b3J5IjoidmlhZiJ9PC9jdzpjd3JjSW5mbz4KCQkJPGN3OmN3cmNB\ndHRyaWJ1dGVzIHhtbG5zOmN3PSJodHRwOi8vY3dyYy5jYS9ucy9jdyMiPnsi\nY2VydCI6ImRlZmluaXRlIiwidHlwZSI6InJlYWwiLCJyZWYiOiJodHRwOi8v\ndmlhZi5vcmcvdmlhZi8zOTU2OTc1MiJ9PC9jdzpjd3JjQXR0cmlidXRlcz4K\nCQk8L3JkZjpEZXNjcmlwdGlvbj4KCQk8cmRmOkRlc2NyaXB0aW9uIHhtbG5z\nOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4\nLW5zIyIgcmRmOmFib3V0PSJodHRwOi8vY3dyYy1kZXYtMDEuc3J2LnVhbGJl\ncnRhLmNhL2lzbGFuZG9yYS9vYmplY3QvNzNjMzM0ZDMtMjYyOS00ZjYzLTgz\nNWItMjNmYzBhNzA2ZDdjIj4KCQkJPHJkZjp0eXBlIHJkZjpyZXNvdXJjZT0i\naHR0cDovL3d3dy53My5vcmcvbnMvb2EjU2VtYW50aWNUYWciLz4KCQkJPHJk\nZjp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3htbG5zLmNvbS9mb2FmLzAu\nMS9QZXJzb24iLz4KCQk8L3JkZjpEZXNjcmlwdGlvbj4KCQk8cmRmOkRlc2Ny\naXB0aW9uIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8y\nMi1yZGYtc3ludGF4LW5zIyIgcmRmOmFib3V0PSJodHRwOi8vaWQuY3dyYy5j\nYS90YXJnZXQvMTY4YmEzOWQtMmJiOS00NjRkLWIzM2EtMDEzZmE2MzBkMmMx\nIj4KCQkJPG9hOmhhc1NvdXJjZSB4bWxuczpvYT0iaHR0cDovL3d3dy53My5v\ncmcvbnMvb2EjIiByZGY6cmVzb3VyY2U9Imh0dHA6Ly9pZC5jd3JjLmNhL2Rv\nYy85YTgxMzIzNi00YjRlLTRmMzEtYjQxOC03YTE4M2EyODViNWUiLz4KCQkJ\nPHJkZjp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3d3dy53My5vcmcvbnMv\nb2EjU3BlY2lmaWNSZXNvdXJjZSIvPgoJCQk8b2E6aGFzU2VsZWN0b3IgeG1s\nbnM6b2E9Imh0dHA6Ly93d3cudzMub3JnL25zL29hIyIgcmRmOnJlc291cmNl\nPSJodHRwOi8vaWQuY3dyYy5jYS9zZWxlY3Rvci82YjRiYmQxYS1iODg3LTQ5\nOGItYjVmNy1iZTQwMWJmY2Q2ZDkiLz4KCQk8L3JkZjpEZXNjcmlwdGlvbj4K\nCQk8cmRmOkRlc2NyaXB0aW9uIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5v\ncmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgcmRmOmFib3V0PSJodHRw\nOi8vaWQuY3dyYy5jYS9zZWxlY3Rvci82YjRiYmQxYS1iODg3LTQ5OGItYjVm\nNy1iZTQwMWJmY2Q2ZDkiPgoJCQk8cmRmOnZhbHVlPnhwb2ludGVyKC8vcGVy\nc05hbWVbQGFubm90YXRpb25JZD0iZW50XzYyIl0pPC9yZGY6dmFsdWU+CgkJ\nCTxyZGY6dHlwZSByZGY6cmVzb3VyY2U9Imh0dHA6Ly93d3cudzMub3JnL25z\nL29hI0ZyYWdtZW50U2VsZWN0b3IiLz4KCQk8L3JkZjpEZXNjcmlwdGlvbj4K\nCTwvcmRmOlJERj4KCTx0ZWlIZWFkZXI+CgkJPGZpbGVEZXNjPgoJCQk8dGl0\nbGVTdG10PgoJCQkJPHRpdGxlPlNhbXBsZSBEb2N1bWVudCBUaXRsZTwvdGl0\nbGU+CgkJCTwvdGl0bGVTdG10PgoJCQk8cHVibGljYXRpb25TdG10PgoJCQkJ\nPHAvPgoJCQk8L3B1YmxpY2F0aW9uU3RtdD4KCQkJPHNvdXJjZURlc2Mgc2Ft\nZUFzPSJodHRwOi8vd3d3LmN3cmMuY2EiPgoJCQkJPHA+Q3JlYXRlZCBmcm9t\nIG9yaWdpbmFsIHJlc2VhcmNoIGJ5IG1lbWJlcnMgb2YgQ1dSQy9DU++/vUMg\ndW5sZXNzIG90aGVyd2lzZSBub3RlZC48L3A+CgkJCTwvc291cmNlRGVzYz4K\nCQk8L2ZpbGVEZXNjPgoJPC90ZWlIZWFkZXI+Cgk8dGV4dD4KCQk8Ym9keT4K\nCQkJPGRpdiB0eXBlPSJsZXR0ZXIiPgoJCQkJPGhlYWQ+CgkJCQkJPHRpdGxl\nPlNhbXBsZSBMZXR0ZXIgVGl0bGU8L3RpdGxlPgoJCQkJPC9oZWFkPgoJCQkJ\nPG9wZW5lcj4KCQkJCQk8bm90ZSB0eXBlPSJzZXR0aW5nIj4KCQkJCQkJPHA+\nU29tZSBvcGVuaW5nIG5vdGUgZGVzY3JpYmluZyB0aGUgd3JpdGluZyBzZXR0\naW5nPC9wPgoJCQkJCTwvbm90ZT4KCQkJCQk8ZGF0ZWxpbmU+CgkJCQkJCTxk\nYXRlPlNvbWUgZGF0ZSAoc2V0IGRhdGUgdmFsdWUgaW4gYXR0cmlidXRlKS48\nL2RhdGU+CgkJCQkJPC9kYXRlbGluZT4KCQkJCQk8c2FsdXRlPlNvbWUgc2Fs\ndXRhdGlvbiwgZS5nLiAiRGVhcmVzdCA8cGVyc05hbWUgYW5ub3RhdGlvbklk\nPSJlbnRfNjIiIGNlcnQ9ImRlZmluaXRlIiB0eXBlPSJyZWFsIiByZWY9Imh0\ndHA6Ly92aWFmLm9yZy92aWFmLzM5NTY5NzUyIj5NaXF1ZWw8L3BlcnNOYW1l\nPiI8L3NhbHV0ZT4KCQkJCTwvb3BlbmVyPgoJCQkJPHA+U2FtcGxlIGxldHRl\nciBjb250ZW50PC9wPgoJCQkJPGNsb3Nlcj4KCQkJCQk8c2FsdXRlPlNvbWUg\nY2xvc2luZyBzYWx1dGF0aW9uLCBlLmcuICJXaXRoIGxvdmUuLi4iPC9zYWx1\ndGU+CgkJCQkJPHNpZ25lZD5TZW5kZXIgbmFtZSBhbmQvb3Igc2lnbmF0dXJl\nLjwvc2lnbmVkPgoJCQkJPC9jbG9zZXI+CgkJCTwvZGl2PgoJCTwvYm9keT4K\nCTwvdGV4dD4KPC9URUk+\n","encoding":"base64","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/letter.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/1525a783ddcd2844d75677d3748673d749c99963","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/letter.xml"}}, [ 'Server',
  'GitHub.com',
  'Date',
  'Tue, 14 Mar 2017 03:29:10 GMT',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '7061',
  'Connection',
  'close',
  'Status',
  '200 OK',
  'X-RateLimit-Limit',
  '5000',
  'X-RateLimit-Remaining',
  '4999',
  'X-RateLimit-Reset',
  '1489465750',
  'Cache-Control',
  'private, max-age=60, s-maxage=60',
  'Vary',
  'Accept, Authorization, Cookie, X-GitHub-OTP',
  'ETag',
  '"3a70a0eac710a2f0a7e1ff7d4d5a8806"',
  'Last-Modified',
  'Wed, 07 Dec 2016 19:45:12 GMT',
  'X-OAuth-Scopes',
  '',
  'X-Accepted-OAuth-Scopes',
  '',
  'X-GitHub-Media-Type',
  'github.v3; format=json',
  'Access-Control-Expose-Headers',
  'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Security-Policy',
  'default-src \'none\'',
  'Strict-Transport-Security',
  'max-age=31536000; includeSubdomains; preload',
  'X-Content-Type-Options',
  'nosniff',
  'X-Frame-Options',
  'deny',
  'X-XSS-Protection',
  '1; mode=block',
  'Vary',
  'Accept-Encoding',
  'X-Served-By',
  '173530fed4bbeb1e264b2ed22e8b5c20',
  'X-GitHub-Request-Id',
  'C6FB:DCFF:81252EB:A51FB15:58C76386' ]);



}

function getSearchNock() {
  nock('https://api.github.com:443', {"encodedQueryParams":true})
  .get('/search/code')
  .query(true)
  .reply(200, {"total_count":1,"incomplete_results":false,"items":[{"name":"cwrc-categories","path":"cwrc-categories","sha":"50e94e0bb7c307caab2c791775d63e544ae64bc6","url":"https://api.github.com/repositories/84259758/contents/cwrc-categories?ref=aab4b2d3c14c0121e2d604900711896b1ac8b83c","git_url":"https://api.github.com/repositories/84259758/git/blobs/50e94e0bb7c307caab2c791775d63e544ae64bc6","html_url":"https://github.com/jchartrand/cleanDoc2/blob/aab4b2d3c14c0121e2d604900711896b1ac8b83c/cwrc-categories","repository":{"id":84259758,"name":"cleanDoc2","full_name":"jchartrand/cleanDoc2","owner":{"login":"jchartrand","id":547165,"avatar_url":"https://avatars0.githubusercontent.com/u/547165?v=3","gravatar_id":"","url":"https://api.github.com/users/jchartrand","html_url":"https://github.com/jchartrand","followers_url":"https://api.github.com/users/jchartrand/followers","following_url":"https://api.github.com/users/jchartrand/following{/other_user}","gists_url":"https://api.github.com/users/jchartrand/gists{/gist_id}","starred_url":"https://api.github.com/users/jchartrand/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jchartrand/subscriptions","organizations_url":"https://api.github.com/users/jchartrand/orgs","repos_url":"https://api.github.com/users/jchartrand/repos","events_url":"https://api.github.com/users/jchartrand/events{/privacy}","received_events_url":"https://api.github.com/users/jchartrand/received_events","type":"User","site_admin":false},"private":false,"html_url":"https://github.com/jchartrand/cleanDoc2","description":"a clean cwrc doc","fork":false,"url":"https://api.github.com/repos/jchartrand/cleanDoc2","forks_url":"https://api.github.com/repos/jchartrand/cleanDoc2/forks","keys_url":"https://api.github.com/repos/jchartrand/cleanDoc2/keys{/key_id}","collaborators_url":"https://api.github.com/repos/jchartrand/cleanDoc2/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/jchartrand/cleanDoc2/teams","hooks_url":"https://api.github.com/repos/jchartrand/cleanDoc2/hooks","issue_events_url":"https://api.github.com/repos/jchartrand/cleanDoc2/issues/events{/number}","events_url":"https://api.github.com/repos/jchartrand/cleanDoc2/events","assignees_url":"https://api.github.com/repos/jchartrand/cleanDoc2/assignees{/user}","branches_url":"https://api.github.com/repos/jchartrand/cleanDoc2/branches{/branch}","tags_url":"https://api.github.com/repos/jchartrand/cleanDoc2/tags","blobs_url":"https://api.github.com/repos/jchartrand/cleanDoc2/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/jchartrand/cleanDoc2/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/jchartrand/cleanDoc2/git/refs{/sha}","trees_url":"https://api.github.com/repos/jchartrand/cleanDoc2/git/trees{/sha}","statuses_url":"https://api.github.com/repos/jchartrand/cleanDoc2/statuses/{sha}","languages_url":"https://api.github.com/repos/jchartrand/cleanDoc2/languages","stargazers_url":"https://api.github.com/repos/jchartrand/cleanDoc2/stargazers","contributors_url":"https://api.github.com/repos/jchartrand/cleanDoc2/contributors","subscribers_url":"https://api.github.com/repos/jchartrand/cleanDoc2/subscribers","subscription_url":"https://api.github.com/repos/jchartrand/cleanDoc2/subscription","commits_url":"https://api.github.com/repos/jchartrand/cleanDoc2/commits{/sha}","git_commits_url":"https://api.github.com/repos/jchartrand/cleanDoc2/git/commits{/sha}","comments_url":"https://api.github.com/repos/jchartrand/cleanDoc2/comments{/number}","issue_comment_url":"https://api.github.com/repos/jchartrand/cleanDoc2/issues/comments{/number}","contents_url":"https://api.github.com/repos/jchartrand/cleanDoc2/contents/{+path}","compare_url":"https://api.github.com/repos/jchartrand/cleanDoc2/compare/{base}...{head}","merges_url":"https://api.github.com/repos/jchartrand/cleanDoc2/merges","archive_url":"https://api.github.com/repos/jchartrand/cleanDoc2/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/jchartrand/cleanDoc2/downloads","issues_url":"https://api.github.com/repos/jchartrand/cleanDoc2/issues{/number}","pulls_url":"https://api.github.com/repos/jchartrand/cleanDoc2/pulls{/number}","milestones_url":"https://api.github.com/repos/jchartrand/cleanDoc2/milestones{/number}","notifications_url":"https://api.github.com/repos/jchartrand/cleanDoc2/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/jchartrand/cleanDoc2/labels{/name}","releases_url":"https://api.github.com/repos/jchartrand/cleanDoc2/releases{/id}","deployments_url":"https://api.github.com/repos/jchartrand/cleanDoc2/deployments"},"score":11.481982}]}, [ 'Server',
  'GitHub.com',
  'Date',
  'Thu, 30 Mar 2017 06:23:59 GMT',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '4651',
  'Connection',
  'close',
  'Status',
  '200 OK',
  'X-RateLimit-Limit',
  '30',
  'X-RateLimit-Remaining',
  '29',
  'X-RateLimit-Reset',
  '1490855099',
  'Cache-Control',
  'no-cache',
  'X-OAuth-Scopes',
  '',
  'X-Accepted-OAuth-Scopes',
  '',
  'X-GitHub-Media-Type',
  'github.v3; format=json',
  'Access-Control-Expose-Headers',
  'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Security-Policy',
  'default-src \'none\'',
  'Strict-Transport-Security',
  'max-age=31536000; includeSubdomains; preload',
  'X-Content-Type-Options',
  'nosniff',
  'X-Frame-Options',
  'deny',
  'X-XSS-Protection',
  '1; mode=block',
  'Vary',
  'Accept-Encoding',
  'X-Served-By',
  'edf23fdc48375d9066b698b8d98062e9',
  'X-GitHub-Request-Id',
  'F486:2C8E5:CC5C09:106DCD5:58DCA47E' ])
}
    
function getTemplatesNock(repoDetails) {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
  .get('/repos/cwrc/CWRC-Writer-Templates/contents/templates')
  .query({"ref":"master","access_token":config.personal_oath_for_testing})
  .reply(200, [{"name":"Sample_Canadian_Women_Playwrights_entry.xml","path":"templates/Sample_Canadian_Women_Playwrights_entry.xml","sha":"c03aab155adf94869e64867204b57f5418521379","size":93879,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/Sample_Canadian_Women_Playwrights_entry.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/Sample_Canadian_Women_Playwrights_entry.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/c03aab155adf94869e64867204b57f5418521379","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/Sample_Canadian_Women_Playwrights_entry.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/Sample_Canadian_Women_Playwrights_entry.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/c03aab155adf94869e64867204b57f5418521379","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/Sample_Canadian_Women_Playwrights_entry.xml"}},{"name":"biography.xml","path":"templates/biography.xml","sha":"df8924ab45525603b11131084bac46a65e40dd05","size":8969,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/biography.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/biography.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/df8924ab45525603b11131084bac46a65e40dd05","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/biography.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/biography.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/df8924ab45525603b11131084bac46a65e40dd05","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/biography.xml"}},{"name":"ceww_new_entry_template.xml","path":"templates/ceww_new_entry_template.xml","sha":"ed224c05b1dd8b2e8053fd880e04c983065698c1","size":12918,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/ceww_new_entry_template.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/ceww_new_entry_template.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/ed224c05b1dd8b2e8053fd880e04c983065698c1","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/ceww_new_entry_template.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/ceww_new_entry_template.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/ed224c05b1dd8b2e8053fd880e04c983065698c1","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/ceww_new_entry_template.xml"}},{"name":"cwrcEntry.xml","path":"templates/cwrcEntry.xml","sha":"5cc998e21ac16e733e8e2d176ac77b1276651d1a","size":1192,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/cwrcEntry.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/cwrcEntry.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/5cc998e21ac16e733e8e2d176ac77b1276651d1a","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/cwrcEntry.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/cwrcEntry.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/5cc998e21ac16e733e8e2d176ac77b1276651d1a","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/cwrcEntry.xml"}},{"name":"letter.xml","path":"templates/letter.xml","sha":"1525a783ddcd2844d75677d3748673d749c99963","size":4470,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/letter.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/letter.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/1525a783ddcd2844d75677d3748673d749c99963","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/letter.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/letter.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/1525a783ddcd2844d75677d3748673d749c99963","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/letter.xml"}},{"name":"poem.xml","path":"templates/poem.xml","sha":"3646f33255208aa71b79ef0a7adaa03af2057ec4","size":9775,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/poem.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/poem.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/3646f33255208aa71b79ef0a7adaa03af2057ec4","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/poem.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/poem.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/3646f33255208aa71b79ef0a7adaa03af2057ec4","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/poem.xml"}},{"name":"prose.xml","path":"templates/prose.xml","sha":"abe5f5729d23b51a54ad4098c182bbd3e70b2d79","size":19730,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/prose.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/prose.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/abe5f5729d23b51a54ad4098c182bbd3e70b2d79","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/prose.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/prose.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/abe5f5729d23b51a54ad4098c182bbd3e70b2d79","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/prose.xml"}},{"name":"sample_biography.xml","path":"templates/sample_biography.xml","sha":"95edb8af9142e198f7b5adda6a2520f606171c1a","size":79937,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_biography.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_biography.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/95edb8af9142e198f7b5adda6a2520f606171c1a","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/sample_biography.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_biography.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/95edb8af9142e198f7b5adda6a2520f606171c1a","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_biography.xml"}},{"name":"sample_letter.xml","path":"templates/sample_letter.xml","sha":"3018280fedf351a4a9330326cd654382aa80984b","size":20765,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_letter.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_letter.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/3018280fedf351a4a9330326cd654382aa80984b","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/sample_letter.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_letter.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/3018280fedf351a4a9330326cd654382aa80984b","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_letter.xml"}},{"name":"sample_poem.xml","path":"templates/sample_poem.xml","sha":"e3fadfac318e076318ffbf69a335470df6a73b42","size":6572,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_poem.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_poem.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/e3fadfac318e076318ffbf69a335470df6a73b42","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/sample_poem.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_poem.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/e3fadfac318e076318ffbf69a335470df6a73b42","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_poem.xml"}},{"name":"sample_writing.xml","path":"templates/sample_writing.xml","sha":"70f5fa95ddd70ae11aa7413d63369dfcabd4d81f","size":93162,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_writing.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_writing.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/70f5fa95ddd70ae11aa7413d63369dfcabd4d81f","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/sample_writing.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/sample_writing.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/70f5fa95ddd70ae11aa7413d63369dfcabd4d81f","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/sample_writing.xml"}},{"name":"writing.xml","path":"templates/writing.xml","sha":"978a11166ed998a61e60732597178eea51ae2daf","size":6316,"url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/writing.xml?ref=master","html_url":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/writing.xml","git_url":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/978a11166ed998a61e60732597178eea51ae2daf","download_url":"https://raw.githubusercontent.com/cwrc/CWRC-Writer-Templates/master/templates/writing.xml","type":"file","_links":{"self":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/contents/templates/writing.xml?ref=master","git":"https://api.github.com/repos/cwrc/CWRC-Writer-Templates/git/blobs/978a11166ed998a61e60732597178eea51ae2daf","html":"https://github.com/cwrc/CWRC-Writer-Templates/blob/master/templates/writing.xml"}}], [ 'Server',
  'GitHub.com',
  'Date',
  'Tue, 14 Mar 2017 00:34:06 GMT',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '11023',
  'Connection',
  'close',
  'Status',
  '200 OK',
  'X-RateLimit-Limit',
  '60',
  'X-RateLimit-Remaining',
  '59',
  'X-RateLimit-Reset',
  '1489455245',
  'Cache-Control',
  'public, max-age=60, s-maxage=60',
  'Vary',
  'Accept',
  'ETag',
  '"3cf589b0fb08096878dfecd1f6fe3ad1"',
  'Last-Modified',
  'Tue, 02 Feb 2016 23:01:13 GMT',
  'X-GitHub-Media-Type',
  'github.v3; format=json',
  'Access-Control-Expose-Headers',
  'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Security-Policy',
  'default-src \'none\'',
  'Strict-Transport-Security',
  'max-age=31536000; includeSubdomains; preload',
  'X-Content-Type-Options',
  'nosniff',
  'X-Frame-Options',
  'deny',
  'X-XSS-Protection',
  '1; mode=block',
  'Vary',
  'Accept-Encoding',
  'X-Served-By',
  '4c8b2d4732c413f4b9aefe394bd65569',
  'X-GitHub-Request-Id',
  'FC15:DCFF:7FA7785:A336296:58C73A7B' ]);


}

function getDoc() {
	return nock('https://api.github.com:443', {"encodedQueryParams":true})
		.get('/repos/jchartrand/aTest/contents/curt/qurt/test.txt')
		.query({"access_token":config.personal_oath_for_testing,"ref":"jchartrand"})
		.reply(200, ["1f8b0800000000000003b5586993aa5812fd2ff5b53a5eb1484ff1222626c405f129a5a220444574b0586c17b44b40b1a3fffb9c04b5ace54d74cfc47cf02d70efcdcc93274fe6e58fbbdccd3677dfef8acdbef8561c8bbb5fee766e11e1895fbe160fbfd31f37eff6918b57f28b2b6e7ce945163702ef49422007ff78095c410e5efc8e27061d5116850ec7e1b07d7cc2f1a2f8d8f9e5ae7c65d81c15c56efffde1c1ddc5dfc2b8884aef9bbfcd1e5e37bbedfe21f123f7b57875f3e0c15dc2","a5077f9b179bbcd83f7c76e75faf9b977fbe6d80b1a8c8d86fefaddc58f874b6c7b6deadc5cf2670260ef870e45f731cfb1ec8c0fee16fa0156c0f39dbbac1078bafeee10c55b9dfbc9e216950fb14d3cd832fc329ea1da5fb25661b04773e0a0f667db9e3598730c8ccda1758e5255c3c353a072d569897e995a3b2d23971b1692ed4c9328c67a7ce8fd97031340ca5f39c7bd6b1f4f1d61d2d38bfbfad26622006b5c439565ad8b554f9995f79f9b43a9f084bb47e573baa2d3fe75a1671c1a8fbeba496b1cf2f83d3b4f4c4713e390da4a7655a4dfb5a354db4c2cf16d964ad4b5ebe88363dbef4eb698cdda3a8f054e9f494e9e2cc186f83d1e2f0143f56363c80edc43664ac949300abaf6b735f26abcff9d96e1288e32450a7a5bd1e73be382e27b91979ea98f9b035c9f46882ddb3701b6afd23a2629a630dd3e7dc596bf7bdb81b6abdeea393b1bdb35a305f985e9e35abddf562ef983ae7ade76fcf7bddf0399f8d16bb403db219d3236fadec1d43197882ce7b9659063d65d5ec3414ce59eb9c36324b473533d79298d33f54f05c659ca7ae6e6c1daaf699b90c549e6bbc851df2cd1f99b1a7b2c45e2f769e202d69f7bb15e4e961961c2abfdff971de15ce7af221b0c67bd7d2239c5c79ac8de2393fc74cbb4e9e68d6b6600ee065a28d1089652a5f70a141989044c692371b8d777da9ef67266c98a9a63ab5277021f2bf730456dae024de9d8037ac8440cdced310360a9b985a2b95132b7d931ff7279cbe3c74589f90f254f344ef02354206839d2fac422f93916fc79a9714d72d3a1351af82f538f990bdc789e0ec70521319ad87e7401e5eee0cd58c908dfaca887574c57ba68e2b6794de722075d7367607237670961c32617238a5fe88834ba7dee0dfe4e1cc2078be9496b6c51f90f3707939a1c78573e0108cc69197cdc3558eb80573eff514ceab812cacf89c04cc3d6b15da9684ba5ab4b94c598a6a61a8a517fd84ca5075203597b55c01fee3c8ce8e0cb55f3b5653a189263e2da7a846fc0ced7ea50e393f63896b0dc295d8280423549df5f8b4cc8685b3ec84134399d9e2024ca54c697ded38e9758f3881c7cab62a96ef79301122665b9faa44c5b960bdff9e35840c45c36e32f9c6f7bed4c34984397804ee964eada4013008d4c7d017a2c815d3905073adcee344ecdecf46dd7bc3eabc7b4615da7d57b3d7ca18297bdbd25913aba1007b09bc1872ae259786051433b384ede1e351efdf609b2d1854a2445d5fb1fda87d8e60561e4e256db9a8a00d664f4f7a62c7b3543e79ea233cbeb10fac292ae2017637ec86e76fd5dfa082a75fa23553890f266a5cba22897cb7bad1ea1ae2fa598c8850001f42d47f1df4b99814ea39c759c07c05b50db68ed591b564204d4fab62baec16d36410cf127021191c2649c38514aaf485edcb1be856093e5d55e95c1527db3af2b072bf40d5904204bd2e50c3aeeb9bab4ab5f157a8869214bbc9b5a16cedb5c334358a9c9e527aa72332467cd2d461495a71d6cab143715912b746379af63430a4ade237558a9e68df275dbbb0b1d1d64be7b9ed50e891e2245f30d7e093e77c92c9b55353af7a043add185da1a2aa75a182f09074aecde07bf56aac3419835e110b57f71a7a0aba20f36325f333b9d046ac0a0ce584bc24c8e498de3bf93c9c9d59fc9cff271eb72c4636553973729d058337e5982ee73c6cc74a82cae7105bea58d0cc8c81311ae976f629de2c60e840d4254e1431785e3fd67ae29ff493064594d0bbe4c415a2ca53b98f3cdf6bea98476744044dd6a897a8d2ce2675172464aeed1d46266fbd58d9e117e1078d7398472a6228922702517598a25321631e507055564ce2eb99e8341287f3779ea1a01249351729e51aba8a5d8b4a1be80d93c07375887ed209","eddca41d2d97d44e0e0ff966353af4a4eda9d4e3d6d0f7521ba4840b3cb7a1768861e60bc70a19623e38840927da180ac31456225bf9a4a7f4fc1c8a919b7be4bf1758c73d3cdf1253f1a477e1f098911f4db783c7a406c097c10fa8d3a1f56f1444be40be75c016033dc45d4f9b9e88bc96886bdb4c1ad691f92ab0cf566407b1422555b9726b25c29a68a3a6a4a9381fa89d5029a933c28c244eb13ad8624ed86215ef679851c0d8603d6f7cb10945f02f18993433015fbff6a11947de8e15116ab845162bf28374c6ce64ca7185cc2d034b823ab013703879b53246be47e00fb2d69c8b1aa6ca43b7cb1cabd130bc1f43cf8003558bd0297cf5c8fba20e7f28ee39656a84aeb6d6a9f3ed81751337ba7f89c9200cd65d64e89cc99e0294c912fe8f0a46c670e6cc209652cf50e259ac40f179e45dce34959780478dae28d0cc82be03147d307688eaedfe78a7a9ad22abfad6131855e497fd83b45547af9d8df41d6c23035f7599cbaa006cf2886b3871961c13cc4ff545c9b0bb9dfb6eb4cce6516b2231128ad9aca6e90f9cac90c5773db5f5dc25c650dda84e4559b9f21d1c73d73aaa660eced19a55d832a8ad16aa5053803a009d88662720c28071d3c7802da3598572b075c11664acc57b44d31fcde72d2b3a2131167353d6725a89a0f6c7690fdc265f88bde07fa3e994459cece087b88d0b87d2700535821f8cf0c6540fd53832d4fdca139a9a2bf0fb9d66592f33e1eb11158a8a04c75b4d79024b5caabe7e4a934d06c438e0d0f44eec6c94c213ecd67b95c7d4e3833b987ca200d83ba85f62264e10ed751abae03855c906358809e41c73807bd231259f50df025ff9f9b80ac07ad26b4c52d8813a024a17ddfe996a0335e847abdbf3b7c9ee2f4e1fb04d53cddbf4c1ebfd909f26b8f3a5a875d26fe2191042d77fc244caa80e509d1ce51e35862a446e8b25d43d104c4c03c3521beae01643574a917bc43d9a23434389f4c511482186093406f9c6398d22a2e2f78ea55365b226bff4f7c0a95d037a4b391fe24e829abecd7f9331e41667c336f18d1819642cd20667cfe376da7b37198c1460d469a65cdcf19ad8aeb7bab652312f403988a93bdc2aa24bcfd958328f1a07ef87e806e7de84ee87bebd8686a3b66826c1648d2e144077867c33f98d74eeeab5a124c834e6167069477c43dc31e926cd89ce687a6646831eeea30c1a4acf64a8258fbb497b97c1d493e0f696a640830b7112261be500ae49504b3093fa4a3301a3de87f0a399063033ad60c5a42ed8cec717e545cff8022555df7bd0d18f5338e2c61df0328ba102b10a53556be35cf73c4f37b7c992d469b8473d7c35ed41e51cf4f04ff71f9add460aee267ac3b5db1b263af0fbef0d98764c062e9d1c4302ae5c85dcb3a0969917cb314d287e06351e8297502cea44a8e78fb78acb8df97c73fad9bd896687c50b265ae967d3cfcd9c1879981b6fa7a1e79cbe5010339db8fd3ad2fefb11537e5aebfdc149afb5fb79c3c5f606073fae37919b5e82fbe8572bcef33bbad467549bdd98153fe793266edc54af5f3426c2db4d96ee6c0e6eb9cdcde271c2e3cb0f66f2e71c1f9136b9bf0de23cc45724cfdd6f7eede0d96f2cced3fdddf73feef61bf6f2fffdea872f6d7fdbc07ff5758e3e2fde58fa1f3f2dfef9e7bf016a96151c7d150000"], [ 'Server',
			'GitHub.com',
			'Date',
			'Thu, 24 May 2018 20:56:00 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4985',
			'X-RateLimit-Reset',
			'1527195996',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"9fa3ec5f93e21b52d9d7fda29dfc4b3d43932400"',
			'Last-Modified',
			'Thu, 24 May 2018 19:23:25 GMT',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			'default-src \'none\'',
			'X-Runtime-rack',
			'0.084094',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'B0E8:3F8D:AF39CD:16279DA:5B0726E0' ]);

}

function saveDocExistingSHA() {
	return nock('https://api.github.com:443', {"encodedQueryParams":true})
		.post('/graphql', {"query":"{\n\t\t\trepository(owner: \"jchartrand\", name: \"aTest\") {\n\t\t\t\tobject(expression: \"jchartrand:curt/qurt/test.txt\") {\n\t\t\t\t\t... on Blob {\n\t\t\t\t\t\toid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}"})
		.query({"access_token":config.personal_oath_for_testing})
		.reply(200, ["1f8b08000000000000031dc74b0e80200c00d1bbf404d8624cb94da16d821b0cb231c4bbfb99d59b092a43204de876b4b38ed6afef5adead8c5f552101bb9095d5990c97bca2b26eae82ac5e62268dc4843104b8df1e44b3d74655000000"], [ 'Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 11:05:37 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4990',
			'X-RateLimit-Reset',
			'1527248435',
			'Cache-Control',
			'no-cache',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'repo',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			'default-src \'none\'',
			'X-Runtime-rack',
			'0.075558',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'9173:3F8D:1156107:2352963:5B07EE01' ]);
}

function saveDoc() {
	return nock('https://api.github.com:443', {"encodedQueryParams":true})
		.put('/repos/jchartrand/aTest/contents/curt/qurt/test.txt', {"message":"some commit message","sha":"9fa3ec5f93e21b52d9d7fda29dfc4b3d43932400","branch":"jchartrand","content":"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPFRFSSB4bWxucz0iaHR0cDovL3d3dy50ZWktYy5vcmcvbnMvMS4wIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOmN3PSJodHRwOi8vY3dyYy5jYS9ucy9jdyMiIHhtbG5zOnc9Imh0dHA6Ly9jd3JjdGMuYXJ0c3JuLnVhbGJlcnRhLmNhLyMiPgogIDx0ZWlIZWFkZXI+CiAgICA8ZmlsZURlc2M+CiAgICAgIDx0aXRsZVN0bXQ+CiAgICAgICAgPHRpdGxlPlNhbXBsZSBEb2N1bWVudCBUaXRsZSB0ZXN0IHVuZGVmaW5lZDwvdGl0bGU+CiAgICAgIDwvdGl0bGVTdG10PgogICAgICA8cHVibGljYXRpb25TdG10PgogICAgICAgIDxwPjwvcD4KICAgICAgPC9wdWJsaWNhdGlvblN0bXQ+CiAgICAgIDxzb3VyY2VEZXNjIHNhbWVBcz0iaHR0cDovL3d3dy5jd3JjLmNhIj4KICAgICAgICA8cD5DcmVhdGVkIGZyb20gb3JpZ2luYWwgcmVzZWFyY2ggYnkgbWVtYmVycyBvZiBDV1JDL0NTw4lDIHVubGVzcyBvdGhlcndpc2Ugbm90ZWQuPC9wPgogICAgICA8L3NvdXJjZURlc2M+CiAgICA8L2ZpbGVEZXNjPgogIDwvdGVpSGVhZGVyPgogIDx0ZXh0PgogICAgPGJvZHk+CiAgICAgIDxkaXYgdHlwZT0ibGV0dGVyIj4KICAgICAgICA8aGVhZD4KICAgICAgICAgIDx0aXRsZT5TYW1wbGUgTGV0dGVyIC0gQmVydHJhbmQgUnVzc2VsbCB0byA8cGVyc05hbWUgYW5ub3RhdGlvbklkPSJlbnRfNzMiIGNlcnQ9InByb2JhYmxlIiByZWY9IjI3OTM5OTM5OSI+UGF0cmljaWEgU3BlbmNlPC9wZXJzTmFtZT4gLSBPY3RvYmVyIDIxLCAxOTM1PC90aXRsZT4KICAgICAgICA8L2hlYWQ+CiAgICAgICAgPG9wZW5lcj4KICAgICAgICAgIDxub3RlPgogICAgICAgICAgICA8cD5CYWQgd3JpdGluZyBkdWUgdG8gc2hha3kgdHJhaW48L3A+PHA+SW4gdHJhaW48L3A+PHA+CiAgICAgICAgICAgICAgPHBsYWNlTmFtZSBhbm5vdGF0aW9uSWQ9ImVudF8xNDMiIGNlcnQ9ImRlZmluaXRlIiByZWY9Imh0dHA6Ly93d3cuZ2VvbmFtZXMub3JnLzY0NTMzNjYiPk9zbG88L3BsYWNlTmFtZT4gdG8gQmVyZ2VuPC9wPgogICAgICAgICAgPC9ub3RlPgogICAgICAgICAgPGRhdGVsaW5lPgogICAgICAgICAgICA8ZGF0ZSBhbm5vdGF0aW9uSWQ9ImVudF82OSIgY2VydD0iZGVmaW5pdGUiIHdoZW49IjE5MzUtMTAtMjEiPjIxLjEwLjM1PC9kYXRlPgogICAgICAgICAgPC9kYXRlbGluZT4KICAgICAgICAgIDxzYWx1dGU+RGVhcmVzdCAtPC9zYWx1dGU+CiAgICAgICAgPC9vcGVuZXI+PHA+SSBoYXZlIGhhZCBubzxub3RlIGFubm90YXRpb25JZD0iZW50XzE5MCIgdHlwZT0icmVzZWFyY2hOb3RlIj4KICAgICAgICAgICAgICAgIDxwIHhtbG5zPSJodHRwOi8vd3d3LnRlaS1jLm9yZy9ucy8xLjAiPlNvbWUga2luZCBvZiBub3RlPC9wPgogICAgICAgICAgICA8L25vdGU+IGxldHRlciBmcm9tIHlvdSBzaW5jZSBJIGxlZnQgPHBsYWNlTmFtZSBhbm5vdGF0aW9uSWQ9ImVudF8xNDUiIG9mZnNldElkPSJlbnRfMTQ1IiBjZXJ0PSJkZWZpbml0ZSIgcmVmPSJodHRwOi8vd3d3Lmdlb25hbWVzLm9yZy8yNjczNzIyIj5TdG9ja2hvbG08L3BsYWNlTmFtZT4sIGJ1dCBJIGhhZCBhIG5pY2Ugb25lIGZyb20gSm9obiBpbiBhbiBlbnZlbG9wZSB5b3UgaGFkIHNlbnQgaGltLiBJIGhhZCBzZW50IGhpbSBvbmUgYWRkcmVzc2VkIHRvIENvcGVuaGFnZW4gYnV0IGhlIGhhZG4ndCB1c2VkIGl0LjwvcD48cD5XaGVuIEkgcmVhY2hlZCBPc2xvIHllc3RlcmRheSBldmVuaW5nLCBCcnluanVsZiBCdWxsIHNob3VsZCBoYXZlIGJlZW4gdGhlcmUgdG8gbWVldCBtZSwgYnV0IHdhc24ndC4gSGUgaXMgbm90IG9uIHRoZSB0ZWxlcGhvbmUsIHNvIEkgdG9vayBhIHRheGkgdG8gaGlzIGFkZHJlc3MsIHdoaWNoIHR1cm5lZCBvdXQgdG8gYmUgYSBzdHVkZW50cycgY2x1YiB3aXRoIG5vIG9uZSBhYm91dCBvbiBTdW5kYXlzLCBzbyBJIHdlbnQgdG8gYSBob3RlbCBmZWVsaW5nIHJhdGhlciBub24tcGx1c3NlZC4gQnV0IHByZXNlbnRseSBoZSB0dXJuZWQgdXAuIEhlIGhhZCBnb3QgdGhlIDxwYiBuPSIyIj48L3BiPiB0aW1lIG9mIG15IGFycml2YWwgd3JvbmcsIGFuZCAKICAgICAgICAgICAgPGNob2ljZSBhbm5vdGF0aW9uSWQ9ImVudF82NSI+PHNpYyBhbm5vdGF0aW9uSWQ9ImVudF82NSI+d2hlbjwvc2ljPjxjb3JyIGFubm90YXRpb25JZD0iZW50XzY1Ij53aGVuPC9jb3JyPjwvY2hvaWNlPgogICAgICAgICAgaGUgaGFkIGZvdW5kIGhlIGhhZCBtaXNzZWQgbWUgaGUgcGhvbmVkIHRvIGV2ZXJ5IGhvdGVsIGluIE9zbG8gdGlsbCBoZSBoaXQgb24gdGhlIHJpZ2h0IG9uZS4gSGUgbGVmdCBtZSBhdCAxMCwgYW5kIHRoZW4gSSBoYWQgdG8gZG8gYSBTdW5kYXkgUmVmZXJlZSBhcnRpY2xlLiBUb2RheSBteSBqb3VybmV5IGxhc3RzIGZyb20gOSB0aWxsIDkgLSBmb3J0dW5hdGVseSBvbmUgb2YgdGhlIG1vc3QgYmVhdXRpZnVsIHJhaWx3YXkgam91cm5leXMgaW4gdGhlIHdvcmxkLiBUb21vcnJvdyBJIGxlY3R1cmUgYXQgPHBsYWNlTmFtZSBhbm5vdGF0aW9uSWQ9ImVudF8xNDQiIGNlcnQ9ImRlZmluaXRlIiByZWY9Imh0dHA6Ly93d3cuZ2VvbmFtZXMub3JnLzY1NDg1MjgiPkJlcmdlbjwvcGxhY2VOYW1lPiB0byB0aGUgQW5nbG8tTm9yd2VnaWFuIFNvY2lldHkuIE5leHQgZGF5IEkgZ28gYmFjayB0byBPc2xvLCBsZWN0dXJlIHRoZXJlIEZyaS4gYW5kIFNhdC4gYW5kIHRoZW4gc3RhcnQgZm9yIGhvbWUgdmlhIEJlcmdlbi48L3A+CiAgICAgICAgPHBiIG49IjMiPjwvcGI+CiAgICAgICAgPHA+QnVsbCBpcyBhIG5pY2UgeW91bmcgbWFuIGJ1dCBpbmNvbXBldGVudCAtIGNhbid0IHF1aXRlIHN0YW5kIHRoZSBjb21tdW5pc3RzLCBidXQgZmluZHMgdGhlIHNvY2lhbGlzdHMgdG9vIG1pbGQuPC9wPjxwPkkgYW0gdW5oYXBwaWx5IHdvbmRlcmluZyB3aGF0IHlvdSBhcmUgZmVlbGluZyBhYm91dCBtZS48L3A+CiAgICAgICAgPGNsb3Nlcj4KICAgICAgICAgIDxzYWx1dGU+SSBsb3ZlIHlvdSB2ZXJ5IG11Y2ggLTwvc2FsdXRlPgogICAgICAgICAgPHNpZ25lZD4KICAgICAgICAgICAgPHBlcnNOYW1lIHNhbWVBcz0iaHR0cDovL3d3dy5mcmVlYmFzZS5jb20vdmlldy9lbi9iZXJ0cmFuZF9ydXNzZWxsIj4KICAgICAgICAgICAgICA8cGVyc05hbWUgYW5ub3RhdGlvbklkPSJlbnRfMTA5IiBjZXJ0PSJkZWZpbml0ZSIgdHlwZT0icmVhbCIgcmVmPSJodHRwOi8vdmlhZi5vcmcvdmlhZi8zNjkyNDEzNyI+QjwvcGVyc05hbWU+CiAgICAgICAgICAgIDwvcGVyc05hbWU+CiAgICAgICAgICA8L3NpZ25lZD4KICAgICAgICA8L2Nsb3Nlcj4KICAgICAgPC9kaXY+CiAgICA8L2JvZHk+CiAgPC90ZXh0Pgo8L1RFST4K"})
		.query({"access_token":config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003b5954d8fd3301086ff4ae573b7499c0f27911048dc38ef098456137bdc64c947b11d966595ffce98b4256c39f4437b891a3b9e67e69dd7d3172687de61ef58f9c27ae89095cca1751bf7d3b135db81ab69458ec605dffd63b1676ba0ad42438c32d5458c3caa52ae0a25b4025e282d932a56495cc43c09430a669b5f143e8ef364cd46d3d2e1dab99d2d830076cd66dbb87aac3672e80283bbc1068fb206e30cf42a807b4a29d8676a83d374de1bd4effe1e2058edbaf6e15fca827012bb6a876a493c45504c0af02ae47989d3b9c0036c70815a6a78eadb01d42ba281a7bd54a345b397e48f6a27352d16fe","5b8e7bdef976eba6452aeea16dfa6fd6dbc062abdfb63924c8c580ab44f42e58906e74c034ade9ba749dcf9e649afd2f10f34c4691282215cb84a75a855106b95010653cd3428492b649e16b3cefab9e91649ef35117ba7f265c0280d1d583590c8d4f343beceae3e1ca52b9d841e3c57f949be34dfeb0f58bdeaef48102e7fdc7c328bf0bd33b9ede475119a6652c3eb3a3d20edf96e20c5212876e2a2122918732e69267521550856104902b25d34a67558e3962a1921bbae98136381b444290b016b65e2a3b74b89a9bb53aacfa216d6880d3d5fd722c2356150aa8320e982b8e31a7c465a5812c14d1af4c270240e91bca3898529d8fbace946703a6af6bf6034da31b09ae197adfd5f91d152b35b416d7cc2058bfc5c6de36db9e76fcffd2b607371a52b81fdbd60bfaec27effc3a4dd36f8e7067f125070000"], [ 'Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 11:05:38 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4988',
			'X-RateLimit-Reset',
			'1527248748',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"4a72614aa5512420e533807eb195b8a6"',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			'default-src \'none\'',
			'X-Runtime-rack',
			'0.693413',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'9F7F:3F8B:8B5138:1387AA9:5B07EE01' ]);
}

function masterBranchSHAs() {
	return nock('https://api.github.com:443', {"encodedQueryParams":true})
		.get('/repos/jchartrand/aTest/branches/master')
		.query(true)
		.reply(200, ["1f8b0800000000000003ed574b6fdb300cfe2b81ce69fd7e05183660b79dbbcb86c2906dd956e7489e24a7eb82fcf7918af372b12e0eb05b0f011249fcf8f11329325b22e89a911559536d98224b52caf59a1bb2da12dd52d8f0a220cbe2240b82348e691a47554643166529adfdca77d3280cca9856c985291d4c2b15828cf05fc08b5e7c6ea9328a8a0a0eb335e51de03f95f7e561f953838bf740010e54d42031dff5d23b37ba73bd072f5879eeca4dbe91dd812772fe9f5e80b5a60df2a0429a96a9c55e9fc5b8b1906201cb8ba1b77497c42806a70fe2a57595866515a77e9479991fd224f613df4b3d90cfad6acf0dc3382d","12170c07856ab4c6f47ae538b4e7f70d37ed50a01a8e62bdd4ced35128873e306d1c38e1a043ed5ced0894bbd5d33e72edcccc08264c5eca41404eb94bb2618ad7bca4864b813aed7fb38aac6ada69b6248a518d5b64109a3702769604bf50332850560c5db7243d7de9240523fcb9bb31a61be269cdbacb2ff53bbba557f7b3f77083607ae2e4ba74981b908306703d1a243e556c271b8efa9fa2816d0e5a4761e2c5111cdd5043d594a15dd4c198b58366aa94c200ba4de0c1d95b7fdc7c0801ae512308e2927f653f829d673f9cbff622e0682dbb4e3e03c294f165894d9d3847bb230617cd4d1860b775eceb91a3971d0ac0b5994bc8da6ca1e8b5c97985281a2457ac9a496ab4024acf02d86cedeb62e18642978af7589b73c95dd80296540d15fcb7adf3b958608b29691fbd99b1591bb0651bcceb99c67ba3add32bbea1e50b4aa258c9f80624be0970620d78e6a5c766f215d20005e786e5b45a63bdd9e76fdad7de6bd18e0befb5f8d670f0eae57aaf456838939e018fdc45255f558b3d55b63daebe1f06ba2028a234814f914549c2129a1461eab92cf4dc20f393d4cd623f669e0ff0b78c59870e3ec3cdb59d701c19c791e46a07bb477893f28e8b1f2003a8c0ba7af6985a400d972d4ca9c73f1948fa0ce6ad190ae7db832150e99534ac346703e3b832ce934cd0a2bb18277f0e1c7b24743d33e81c7894fb5098a8a52a190e407907cf3b1292750d376707975ff6de1f71b83c7978bba1fc654a9f840fedc5868084777f0066a2855f800d0000"], [ 'Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 13:20:50 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4999',
			'X-RateLimit-Reset',
			'1527258050',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"be141d5c7dbe3dfd04b6969cedf909d6"',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			'default-src \'none\'',
			'X-Runtime-rack',
			'0.072190',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'8C61:3F8E:16E16D6:2C44F1A:5B080DB2' ]);
}

function getRepoGetTree(){
	return nock('https://api.github.com:443', {"encodedQueryParams":true})
		.get('/repos/jchartrand/aTest/git/trees/8fd84cd682591924a7627218198a0df104468b70')
		.query(true)
		.reply(200, ["1f8b0800000000000003dd974d6f13311086ffcb9e51766c8fbf7a43024e7041dc1087f1784c82926cc86e101fea7fc79b42a94a056ef716dfacc47afde89d997dfda31bd7d45d75a1e4809c5dd036aaa891bcd35eaba06220c84501a20bc943f7ac3b1db7f5c07a9a0ee355dfd361b3fab899d6a7b4e261d71fe5308cfd275ed3713ad23ef7f44ec6a9afffe8a7a3c8d83f42683ed05dbdffd11d685a57c9b72f9fbf78f372b5cbf512bb21d7df3a05e010eb7efa7698f7693ba4babb61f2a885d8859c7cc9c6","c7a25256ba2ef40e129668552a24f3f171f3bd1ef74f879b85c7be59f1fad92d15edf7c344d366d88fab4fe3b06f8483e2920803287011d86b56113063206460f60599c901dfc229b794ae59f20e1d9f8ed31f2240a8eb8f5d67877fdb659ccd1a5d7651650226b03942ae5655301022a37db2d1b97a605909360bdde3e8533b0cf8526f1c5119c371beb9f1a804b178256090a3b20c37f62c8369167a08a69f6a73aea6af772cfa6747c54246d8966844ab64758eb9b616e9980b6332194d65ad1edf169d31019f6ed74d53358bde27cc9764d70c73d9767d6eb7cba9da5b3140243036c40c756b6d498e7442833a602c81f43c5b967557b3d0fdda9b612edfae33a1bad801f2adbd229bc7f0d28a6c16ba5f9133ccc556641ef8b493fdb4fabadb3606a8281488d980d20cde39ed581c48313e478c5c33082a2f25dc7ecbd04678ba7bbfbe65ada277dc1b879dbcd81c5b53544d7dc513ba62c967efbdc5085a13e79a0b8b246294e888168f46d32af4374a4faf365b79c4d8d052b4f3a26dca8e1d198094d09bea172688bace7d0c569b73f43f277965963ad52cf900de283cecf36bf922db76e332dabad41ca0084472d0de8351c67bf4d10941098ca12c8fbfcd42ff25ebef809e1d7dc4fba5e647d29c6aa582879a928d132c463391af013399e012477ff33c385b6a16375fb3e4f587faa03c9ef64c93e4eeaad07694eb9f27ad68bb2a0f0000"], [ 'Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 13:20:50 GMT',
			'Content-Type',
			'application/json; charset=utf-8',
			'Transfer-Encoding',
			'chunked',
			'Connection',
			'close',
			'Status',
			'200 OK',
			'X-RateLimit-Limit',
			'5000',
			'X-RateLimit-Remaining',
			'4998',
			'X-RateLimit-Reset',
			'1527258050',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"4d9cc9bda36c45c37e0f9383ad478f57"',
			'Last-Modified',
			'Tue, 01 May 2018 13:10:09 GMT',
			'X-OAuth-Scopes',
			'repo',
			'X-Accepted-OAuth-Scopes',
			'',
			'X-GitHub-Media-Type',
			'github.v3; format=json',
			'Access-Control-Expose-Headers',
			'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
			'Access-Control-Allow-Origin',
			'*',
			'Strict-Transport-Security',
			'max-age=31536000; includeSubdomains; preload',
			'X-Frame-Options',
			'deny',
			'X-Content-Type-Options',
			'nosniff',
			'X-XSS-Protection',
			'1; mode=block',
			'Referrer-Policy',
			'origin-when-cross-origin, strict-origin-when-cross-origin',
			'Content-Security-Policy',
			'default-src \'none\'',
			'X-Runtime-rack',
			'0.060047',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'BEF6:3F8D:1276F43:25AC33B:5B080DB2' ]);
}
module.exports = {
  getDetailsForAuthenticatedUserNock: getDetailsForAuthenticatedUserNock,
  getGithubCommitNock: getGithubCommitNock,
 // getCreateGithubCWRCBranchNock:getCreateGithubCWRCBranchNock,
  getUpdateGithubCWRCBranchNock:getUpdateGithubCWRCBranchNock,
  getCreateGithubTagNock:getCreateGithubTagNock,
  getGithubTreeNock:getGithubTreeNock,
  getCreateGithubRepoNock: getCreateGithubRepoNock,
  getMasterBranchFromGithubNock: getMasterBranchFromGithubNock,
  getDocumentFromGithubNock:getDocumentFromGithubNock,
  getAnnotationsFromGithubNock:getAnnotationsFromGithubNock,
  getBranchInfoFromGithubNock:getBranchInfoFromGithubNock,
  getReposForGithubUserNock: getReposForGithubUserNock,
  getReposForAuthenticatedUserNock: getReposForAuthenticatedUserNock,
  getTemplatesNock: getTemplatesNock,
  getTemplateNock: getTemplateNock,
  getSearchNock: getSearchNock,
    getDoc: getDoc,
	saveDocExistingSHA: saveDocExistingSHA,
	saveDoc: saveDoc,
	masterBranchSHAs: masterBranchSHAs,
	getRepoGetTree: getRepoGetTree

}
