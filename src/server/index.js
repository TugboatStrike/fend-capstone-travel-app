var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const fetch = require('node-fetch'); // required for fetch


dotenv.config(); // allowing the .env file to be called by dotenv module.


const app = express()

/**** Middleware ****/

// !!!!This needs better explination on usage!!!!!!
// Here we are configuring express to use body-parser as middle-ware.
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
//app.use(cors());


app.use(express.static('dist'))

console.log(__dirname)

// initial webpage call
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
});

// meaning cloud api call details
mc = {
  https: 'https://',
  hostname:  "api.meaningcloud.com",
  key: process.env.MEANING_CLOUD_API_KEY,
  lang: "en",
  types: {
    sent: '/sentiment-2.1?key=',
  },
  fetchOp: {
    method: 'POST',
    redirect: 'follow'
  },
};

// create url for meaning cloud api url fetch call
function textUrl(text, mcType) {
  const tx = encodeURIComponent(text);
  const ht = mc.https;
  const hn = mc.hostname;
  const key = mc.key;
  const lg = mc.lang;
  const type = mcType;
  const mod = 'test';
  //const url = String.raw`${ht}${hn}${type}${key}&lang=${lg}&url=${tx}`;
  const url = String.raw`${ht}${hn}${type}${key}&lang=${lg}&txt=${tx}`;
  return url;
};

// create url for meaning cloud api url fetch call
function urlUrl(urlText, mcType) {
  //const tx = encodeURIComponent(text);
  const txU = urlText;
  const ht = mc.https;
  const hn = mc.hostname;
  const key = mc.key;
  const lg = mc.lang;
  const type = mcType;
  const mod = 'test';
  const url = String.raw`${ht}${hn}${type}${key}&lang=${lg}&url=${txU}`;
  //const url = String.raw`${ht}${hn}${type}${key}&lang=${lg}&txt=${tx}`;
  return url;
};

// meaning cloud sentiment api fetch
async function sentFetch(url) {
  const response = await fetch(url,mc.fetchOp)
  const jsonInfo = await response.json();
  return jsonInfo;
};

// api post call configuration
// this takes the text and fetches the sentiment api
app.post('/sentiment', function(request, response) {
    const dataText = request.body.data;
    const isUrl = request.body.is_url;
    let urlString = '';
    console.log('req Body: ', request.body);
    console.log('start sentiment');
    if (isUrl) {
      urlString = urlUrl(dataText, mc.types.sent)
    } else {
      urlString = textUrl(dataText, mc.types.sent)
    }
    sentFetch(urlString)
      .then(resJson => {
        response.json(resJson);
      }).catch(e => console.log('errSend1',e))
    console.log('end sentiment');
})

async function geoCall(text) {
  const search = encodeURIComponent(text);
  const username = process.env.GEO_NAMES_USERNAME
  const url = `http://api.geonames.org/searchJSON?q=${search}&maxRows=10&username=${username}`;
  const data = await fetch(url)
  const dataJson = await data.json();
  //console.log('geoCall: ', data);
  console.log('geoJson: ', dataJson);
}

geoCall('colorado springs colorado usa')
