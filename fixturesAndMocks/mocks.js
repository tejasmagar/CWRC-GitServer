var nock = require('nock');
var config = require('../config');
var fixtures = require('./fixtures.js');

function getDetailsForAuthenticatedUserNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
    .get('/user')
    .query({"access_token":config.personal_oath_for_testing})
    .reply(200, {"login":fixtures.owner,"id":547165,"avatar_url":"https://avatars.githubusercontent.com/u/547165?v=3","gravatar_id":"","url":"https://api.github.com/users/jchartrand","html_url":"https://github.com/jchartrand","followers_url":"https://api.github.com/users/jchartrand/followers","following_url":"https://api.github.com/users/jchartrand/following{/other_user}","gists_url":"https://api.github.com/users/jchartrand/gists{/gist_id}","starred_url":"https://api.github.com/users/jchartrand/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jchartrand/subscriptions","organizations_url":"https://api.github.com/users/jchartrand/orgs","repos_url":"https://api.github.com/users/jchartrand/repos","events_url":"https://api.github.com/users/jchartrand/events{/privacy}","received_events_url":"https://api.github.com/users/jchartrand/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":null,"location":null,"email":null,"hireable":null,"bio":null,"public_repos":13,"public_gists":0,"followers":3,"following":1,"created_at":"2011-01-04T15:50:51Z","updated_at":"2017-01-31T21:24:53Z"});
}

function getReposForAuthenticatedUserNock() {
  return nock('https://api.github.com:443', {"encodedQueryParams":true})
  .get('/user/repos')
  .query({"access_token":config.personal_oath_for_testing})
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
                  && body.tree[0].content.includes('<encodingDesc><appInfo><application version="1.0" ident="CWRC-GitWriter-web-app" notAfter="')
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
        .reply(201, {"owner": {"login": fixtures.owner}});
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
        .query({"access_token":config.personal_oath_for_testing})
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
  .query({"q":"cwrc-melbourne+repo%3Ajchartrand%2FcleanDoc2","access_token":config.personal_oath_for_testing})
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
  getSearchNock: getSearchNock
}