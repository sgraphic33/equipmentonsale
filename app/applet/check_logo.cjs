const https = require('https');
https.get('https://ais-pre-k2w3tc2gh45ss53sypzoqq-230796301173.us-east5.run.app/logo.png', (res) => {
  console.log("Status: " + res.statusCode);
});
