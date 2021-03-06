var nock = require('nock');
var config = require('../config');
var fixtures = require('./fixtures.js');

// we use the cwrcAppName to match CWRC GitHub repositories that are themselves documemnts,
// but we don't match to match repositories that are code repositories,
// so here we sneakily concatenate the full string to avoid matches on this code repo.
var cwrcAppName = "CWRC-GitWriter" + "-web-app";

function enableAllMocks() {

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/branches/master')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003ed574b6fdb300cfe2b81ce69fd7e05183660b79dbbcb86c2906dd956e7489e24a7eb82fcf7918af372b12e0eb05b0f011249fcf8f11329325b22e89a911559536d98224b52caf59a1bb2da12dd52d8f0a220cbe2240b82348e691a47554643166529adfdca77d3280cca9856c985291d4c2b15828cf05fc08b5e7c6ea9328a8a0a0eb335e51de03f95f7e561f953838bf740010e54d42031dff5d23b37ba73bd072f5879eeca4dbe91dd812772fe9f5e80b5a60df2a0429a96a9c55e9fc5b8b1906201cb8ba1b77497c42806a70fe2a57595866515a77e9479991fd224f613df4b3d90cfad6acf0dc3382d", "12170c07856ab4c6f47ae538b4e7f70d37ed50a01a8e62bdd4ced35128873e306d1c38e1a043ed5ced0894bbd5d33e72edcccc08264c5eca41404eb94bb2618ad7bca4864b813aed7fb38aac6ada69b6248a518d5b64109a3702769604bf50332850560c5db7243d7de9240523fcb9bb31a61be269cdbacb2ff53bbba557f7b3f77083607ae2e4ba74981b908306703d1a243e556c271b8efa9fa2816d0e5a4761e2c5111cdd5043d594a15dd4c198b58366aa94c200ba4de0c1d95b7fdc7c0801ae512308e2927f653f829d673f9cbff622e0682dbb4e3e03c294f165894d9d3847bb230617cd4d1860b775eceb91a3971d0ac0b5994bc8da6ca1e8b5c97985281a2457ac9a496ab4024acf02d86cedeb62e18642978af7589b73c95dd80296540d15fcb7adf3b958608b29691fbd99b1591bb0651bcceb99c67ba3add32bbea1e50b4aa258c9f80624be0970620d78e6a5c766f215d20005e786e5b45a63bdd9e76fdad7de6bd18e0befb5f8d670f0eae57aaf456838939e018fdc45255f558b3d55b63daebe1f06ba2028a234814f914549c2129a1461eab92cf4dc20f393d4cd623f669e0ff0b78c59870e3ec3cdb59d701c19c791e46a07bb477893f28e8b1f2003a8c0ba7af6985a400d972d4ca9c73f1948fa0ce6ad190ae7db832150e99534ac346703e3b832ce934cd0a2bb18277f0e1c7b24743d33e81c7894fb5098a8a52a190e407907cf3b1292750d376707975ff6de1f71b83c7978bba1fc654a9f840fedc5868084777f0066a2855f800d0000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'1527267709',
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
			'0.071160',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'92DD:3F8D:13BA353:28474D8:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/8fd84cd682591924a7627218198a0df104468b70')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003a593bd6edc301084df45b5212da9d552bc2e805da631d20529964b3227e3f40391029c18f7eee1c5c8f94ac5b7dd821c0c3fccf0ad4a47ae0e551f7d8fe2a9d79d5556231bd246ab5ed99ec1470588d43b03d543b5ada72238e6bca443d3f032d43f877cdc5c2df3d8ac619953f322475ef3ca936ff85b48b929379abc86909aff30ba08aac3f7b76ae17c2c96cf4f5f1ebf3ed5a32f8f18675fce2a05408865cfbf96cbee4eb32bdb3b93411d58a8f7ce44df1a1b95f34a974143e030da", "4eb9c8e1224fc3ef22379f87bb18a766b7e3f9e14ac5d33467cec33ca5fa25cdd34e3888e44210000564418c1665013df68c022226a20813c8154ed1bd74bb2d6fe8645bf307112094f988eb6fc2ffe26aa9f31ac993559e41183a6fc197a80a1804e6561bd759a222b8af82bb8d6e38fc2cdb18a65cbf8ea79d09d9c03d8bb4a0b48021d2248120c4d6788b560a242a13627f4d083b0b9f677b6fe06ed31bb6348fe17158f7c6546a150d23c58e8d37c67468416b165f8a178363c16089f9fe98f61a9d7f94ffbf6e93700ebe3a443ea570fe038f55b568d9040000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"e878df79e0fcb5c4abe07558a91d09c6"',
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
			'0.054704',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'900F:3F8C:DFA788:1E75BB5:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/365d246d691da0ca05d90d7601900eaa327b5966')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003dd93bb6ec3300c45ff45b31151d6c396bf235bd181d6a34e91c4ae240f41e07f2f5d14454715deaa8d0289c3832b3d599e900d4c1aed5b65bcb1c2233804ed2df8ce80b0000151b6dda8ad31ac616bbad2c054ca9207ce71b99cde2e655ac7939b6f3c8565cefcdd4d984ac2bbe7780eb970eae0258590f91f40fb001b5e9e6cc13211725c5321fe6df674cd40011daacb63d9ebafeee65b07ba483b5b25a47476df5d764a04a562270248e5acd00e0cb8c33ad5a0adf9f1f0ffc4e3a3", "dec3084ac3f66011a4eead072ab58ea3c1765452b5bdb2b1c7760ff0d8f3aa06fdcae351ef511df7518f6ad0f64a3f20ad778725783644bce6b07d02697441b5d6030000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'4997',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"efb7ac796cf04caddbb80a1902d0eeee"',
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
			'0.093304',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'81F3:3F8E:18684AA:2F48175:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/3ca6f7a46f5a7d777549022acd4c0febac4e96aa')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003a5913d6fc3201086ff0b7314ce7006db73d5a963b7aac30147edca892d2055db28ffbd24559bb51fb7bd82472f0f771479243108edc9444b68624b36586b5bec4129f2013d4476e4917b432436e290e60a8ca5ac799092d669fb3495f1e0b67ed9c9c4eb92e5b31f299544fb20e99e7391f5862c8939cb5f149d01313c1cc54a65ac95743bcdbc2dafa53e62b7847a261a00835873795bcfd9cd8babe9d3497154c6b26a5d30de9006700ead6603e8a057ce1076add217607aaf78a3ff", "6e776ecef2c795a7cdb75666bfecc31dbff07c33a5ab1b20d4b9ba5dbee3cb2d605ba7e9b54202e6d0296b4137da5ab4bd6182d879eca2a9c0fff6f5e3a2d363dd423aec3d150e628834673e7d0072e710e25f020000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'4996',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"cceb007e9646574a82e1d21bd1263e7a"',
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
			'0.091001',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'A944:3F8E:18684AC:2F48178:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/07faa394133c9327b3741e44f71e034c915c060c')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b08000000000000039d8f4b6ec3300c05efa2756149261d573e47764517d4af76e1c48244034983dcbd347a81b6cb0772387c0fd56652933263260287162038e8470f23da8498479b0c60707608e664827a517b5d0598994b9bb4a6b2741f0bcfbbefc276d13595ade9cf3053e54ad7a8e99c1a6bd9d05c536afa0fa20350d3db4315e259942c973abeb1fc70d9a28c9435e6842899efe5c87eddbca49f4a2e13a4306407a9b77ee8a38b638ed4bb98037a880852148d3980e54b708057fc7fbdc3ddf4afa5cf77", "f9baeed7409ca29a32ad2d3dbf019574119f8e010000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'4995',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"c532d868718f80b427e2a99daaf0ce17"',
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
			'0.048058',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'AA2F:3F8B:A344F3:16B9568:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/61a399809a03589d0a3955fb6a2b4342849f8a2e')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b0800000000000003dd91bb4ec4301045ffc5f52a76fc0876be830e518c5f3828bbb1ec89c4ee6aff9d89a8e88092f2c8737ce76aeeac1760339b4650ce59e14028635d1484c6643f81f45a6969b5cb16646227b6b795848258fbcc39d465785bb0ec7e08db99b754b7cedf4381860d2e91c373eac86982634ba9f35f041d029b5feeac02168a44fa69c00fa41dce5ba427360a31694d8cd77ab05f374ff455c965502998ec5492a33732baf89423481773d05e45ad9c925a8843586ea42b65f5dfeb1dd99dff38", "f471fad66bfc3fc55ee91c6dbf04c014d99c61ede9f109c2b90e8f67020000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'4993',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"514a5b3f716f6999ed9f4d4c655ae683"',
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
			'0.058459',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'A64C:3F8B:A344F3:16B956B:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/07faa394133c9327b3741e44f71e034c915c060c')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b08000000000000039d8f4b6ec3300c05efa2756149261d573e47764517d4af76e1c48244034983dcbd347a81b6cb0772387c0fd56652933263260287162038e8470f23da8498479b0c60707608e664827a517b5d0598994b9bb4a6b2741f0bcfbbefc276d13595ade9cf3053e54ad7a8e99c1a6bd9d05c536afa0fa20350d3db4315e259942c973abeb1fc70d9a28c9435e6842899efe5c87eddbca49f4a2e13a4306407a9b77ee8a38b638ed4bb98037a880852148d3980e54b708057fc7fbdc3ddf4afa5cf77", "f9baeed7409ca29a32ad2d3dbf019574119f8e010000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:49 GMT',
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
			'4994',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"c532d868718f80b427e2a99daaf0ce17"',
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
			'0.053441',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'AE96:3F8B:A344F3:16B956A:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/d4555519324a0eed82770313774796ea0f8c48f6')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b08000000000000039d8f416ec3201045efc2ba326008d83e40565d76177531c0503b720c021ca98d72f78ed50bb49ddd97fed3fbf360750636b1a04f747254bd06811886de5aa1a4b256dbd1208838783d44c35ed85e5602e6d6729d3887bc741f4b9b77d7f974e30573aafcea6728adc01638bc616d9c1abc15c4caff203a00365d1e2c439b4959d1a72dbce21dd7f3b26277ad69a33db714a8c6a410466bcaed331fd9adc951fa79af970e7aef2c686185544a19d451f51ec0fa53746a30ce8f9674042c5f84", "2bf1ff470f73e5bf563edf6973d9370f0d039b22ac159fdff769a44098010000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:50 GMT',
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
			'4992',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"0b1ffa03f96dcd40b21a031261a29b59"',
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
			'0.088320',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'8044:3F8B:A344F3:16B956C:5B08336D']);

	nock('https://api.github.com:443', {"encodedQueryParams": true})
		.get('/repos/jchartrand/aTest/git/trees/07faa394133c9327b3741e44f71e034c915c060c')
		.query({"access_token": config.personal_oath_for_testing})
		.reply(200, ["1f8b08000000000000039d8f4b6ec3300c05efa2756149261d573e47764517d4af76e1c48244034983dcbd347a81b6cb0772387c0fd56652933263260287162038e8470f23da8498479b0c60707608e664827a517b5d0598994b9bb4a6b2741f0bcfbbefc276d13595ade9cf3053e54ad7a8e99c1a6bd9d05c536afa0fa20350d3db4315e259942c973abeb1fc70d9a28c9435e6842899efe5c87eddbca49f4a2e13a4306407a9b77ee8a38b638ed4bb98037a880852148d3980e54b708057fc7fbdc3ddf4afa5cf77", "f9baeed7409ca29a32ad2d3dbf019574119f8e010000"], ['Server',
			'GitHub.com',
			'Date',
			'Fri, 25 May 2018 16:01:50 GMT',
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
			'4991',
			'X-RateLimit-Reset',
			'1527267709',
			'Cache-Control',
			'private, max-age=60, s-maxage=60',
			'Vary',
			'Accept, Authorization, Cookie, X-GitHub-OTP',
			'ETag',
			'W/"c532d868718f80b427e2a99daaf0ce17"',
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
			'0.061911',
			'Content-Encoding',
			'gzip',
			'X-GitHub-Request-Id',
			'9AA2:3F8B:A344F3:16B9569:5B08336D']);

}

module.exports = enableAllMocks
