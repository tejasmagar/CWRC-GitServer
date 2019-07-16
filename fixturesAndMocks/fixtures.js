var config = require('../config');
var jwt    = require('jsonwebtoken');

var testDoc = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cw="http://cwrc.ca/ns/cw#" xmlns:w="http://cwrctc.artsrn.ualberta.ca/#">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Sample Document Title test ${versionTimestamp}</title>
      </titleStmt>
      <publicationStmt>
        <p></p>
      </publicationStmt>
      <sourceDesc sameAs="http://www.cwrc.ca">
        <p>Created from original research by members of CWRC/CSÉC unless otherwise noted.</p>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <div type="letter">
        <head>
          <title>Sample Letter - Bertrand Russell to <persName annotationId="ent_73" cert="probable" ref="279399399">Patricia Spence</persName> - October 21, 1935</title>
        </head>
        <opener>
          <note>
            <p>Bad writing due to shaky train</p><p>In train</p><p>
              <placeName annotationId="ent_143" cert="definite" ref="http://www.geonames.org/6453366">Oslo</placeName> to Bergen</p>
          </note>
          <dateline>
            <date annotationId="ent_69" cert="definite" when="1935-10-21">21.10.35</date>
          </dateline>
          <salute>Dearest -</salute>
        </opener><p>I have had no<note annotationId="ent_190" type="researchNote">
                <p xmlns="http://www.tei-c.org/ns/1.0">Some kind of note</p>
            </note> letter from you since I left <placeName annotationId="ent_145" offsetId="ent_145" cert="definite" ref="http://www.geonames.org/2673722">Stockholm</placeName>, but I had a nice one from John in an envelope you had sent him. I had sent him one addressed to Copenhagen but he hadn't used it.</p><p>When I reached Oslo yesterday evening, Brynjulf Bull should have been there to meet me, but wasn't. He is not on the telephone, so I took a taxi to his address, which turned out to be a students' club with no one about on Sundays, so I went to a hotel feeling rather non-plussed. But presently he turned up. He had got the <pb n="2"></pb> time of my arrival wrong, and 
            <choice annotationId="ent_65"><sic annotationId="ent_65">when</sic><corr annotationId="ent_65">when</corr></choice>
          he had found he had missed me he phoned to every hotel in Oslo till he hit on the right one. He left me at 10, and then I had to do a Sunday Referee article. Today my journey lasts from 9 till 9 - fortunately one of the most beautiful railway journeys in the world. Tomorrow I lecture at <placeName annotationId="ent_144" cert="definite" ref="http://www.geonames.org/6548528">Bergen</placeName> to the Anglo-Norwegian Society. Next day I go back to Oslo, lecture there Fri. and Sat. and then start for home via Bergen.</p>
        <pb n="3"></pb>
        <p>Bull is a nice young man but incompetent - can't quite stand the communists, but finds the socialists too mild.</p><p>I am unhappily wondering what you are feeling about me.</p>
        <closer>
          <salute>I love you very much -</salute>
          <signed>
            <persName sameAs="http://www.freebase.com/view/en/bertrand_russell">
              <persName annotationId="ent_109" cert="definite" type="real" ref="http://viaf.org/viaf/36924137">B</persName>
            </persName>
          </signed>
        </closer>
      </div>
    </body>
  </text>
</TEI>
`;

var owner = 'jchartrand';
var testRepo = 'aTest';
var ownerAndRepo = `${owner}/${testRepo}`;
const templateName = 'Sample TEI letter.xml'
var versionTimestamp = Math.floor(Date.now() / 1000);
var base64TestDoc = Buffer.from(testDoc).toString('base64');
var annotationBundleText = "some annotations";
var base64AnnotationBundle = Buffer.from(annotationBundleText).toString('base64');
var aSingleAnno = 'a single anno with timestamped uris ' + versionTimestamp;
var testRepoDescription = "a description of the repo";
var isPrivate = false;

var baseTreeSHA = 'theBASETReeSHAForTesting';
var parentCommitSHA = 'parentCommitSHAForTesting';

var newTreeSHA = 'newTreeSHAForTesting';
var newCommitSHA = 'newCommitSHAForTesting';

var commitMessage = 'saving cwrc draft';

var cwrcJWTTokenContainingGithubOathToken = jwt.sign(config.personal_oath_for_testing, config.jwt_secret_for_testing);
 
var githubToken = config.personal_oath_for_testing

module.exports = {
	testDoc: testDoc,
	owner: owner,
	testRepo: testRepo,
	ownerAndRepo: ownerAndRepo,
	versionTimestamp: versionTimestamp,
	base64TestDoc: base64TestDoc,
	annotationBundleText: annotationBundleText,
	base64AnnotationBundle: base64AnnotationBundle,
	aSingleAnno: aSingleAnno,
	testRepoDescription: testRepoDescription,
	isPrivate: isPrivate,
	baseTreeSHA: baseTreeSHA,
	parentCommitSHA: parentCommitSHA,
	templateName: templateName,
	newTreeSHA: newTreeSHA,
	newCommitSHA: newCommitSHA,
	commitMessage: commitMessage,
	cwrcJWTTokenContainingGithubOathToken:cwrcJWTTokenContainingGithubOathToken,
	githubToken: githubToken
}
