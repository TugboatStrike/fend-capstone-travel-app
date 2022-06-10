var path = require('path')
//const express = require('express')
// moved app outside and then require it for jest Testing
const app = require("./js/app")
const mockAPIResponse = require('./mockAPI.js')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const fetch = require('node-fetch'); // required for fetch

const fs = require('fs');


dotenv.config(); // allowing the .env file to be called by dotenv module.

// again express moved to outside file.
//const app = express()

/**** Middleware ****/

// !!!!This needs better explination on usage!!!!!!
// i think this allows the server side to not need JSON.stringify() ?
// Here we are configuring express to use body-parser as middle-ware.
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
//app.use(cors());

// again express moved to outside file
//app.use(express.static('dist'))

console.log(__dirname);

// initial webpage call
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});

// testing with fake api data
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
    if (isUrl) {
      urlString = urlUrl(dataText, mc.types.sent)
    } else {
      urlString = textUrl(dataText, mc.types.sent)
    }
    sentFetch(urlString)
      .then(resJson => {
        response.json(resJson);
      }).catch(e => console.log('errSend1',e))
})

// url creation for geo call query for lat and long details
function urlGeoCall(text) {
  const key = `&username=${process.env.GEO_NAMES_USERNAME}`;
    // URL for initial API
  const protocol = `http://`;
  const host = `api.geonames.org/searchJSON`;
  const api = `${protocol}${host}?`;
    // OPTIONS for API call
  const query = `q=${encodeURIComponent(text)}`;
  const rows = `&maxRows=1`;
  const options = `${query}${rows}`
    // Final API URL
  const url = `${api}${options}${key}`
  return url
}


// url creation for weatherbit current day weather
function urlWeathCur(lat, lon) {
  const key = `&key=${process.env.WEATHER_BIT_API_KEY}`;
    // URL for initial API
  const protocol = `https://`;
  const host = `api.weatherbit.io/v2.0/current`;
  const api = `${protocol}${host}?`;
    // OPTIONS for API call
  const units = `&units=I`;
  const position = `lat=${lat}&lon=${lon}`;
  const options = `${position}${units}`
    // Final API URL
  const url = `${api}${options}${key}`
  return url
}


// url creation for weatherbit 1-16 day forcast
function urlWeathForcast(lat, lon, length = 1) {
  const key = `&key=${process.env.WEATHER_BIT_API_KEY}`;
    // URL for initial API
  const protocol = `https://`;
  const host = `api.weatherbit.io/v2.0/forecast/daily`;
  const api = `${protocol}${host}?`;
    // OPTIONS for API call
  const units = `&units=I`;
  const position = `lat=${lat}&lon=${lon}`;
  const days = `&days=${intRange(length,1,16)}`;
  const options = `${position}${units}${days}`;
    // Final API URL
  const url = `${api}${options}${key}`;
  return url;
}

// check if value is an intiger and within range of values as intiger.
function intRange(value, min=0, max=100) {

  min = parseInt(min);
  max = parseInt(max);
  if ( isNaN(max)) {
    max = 100;
  }
  if ( isNaN(min)) {
    min = 0;
  }
  if ( isNaN(value)) {
    value = min;
  }else if (value < min) {
    value = min;
  }else if (max < value) {
    value = max;
  }
  // value is within range now truncate and convert to int
  value = parseInt(value);
  return value;
};

// fetch with assumed json data recieved.
// return empty object if there is a error converting to json
async function jsonFetch(url) {
  let dataJson = {err: '',
                  msgSts: '',
                  data: {}
                  }
  await fetch(url)
    .then(handleErrors)
    .then(async response => {
      dataJson.data = await response.json();
      dataJson.msgSts = response.status;
    }).catch(e => {
      dataJson.err = e;
      dataJson.msgSts = e.status;
    })
  return dataJson
}

// Generic way to handle erros to use with .then so the .catch will get it
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}


// Generate pixabay url for api call
function urlPixabay(search, catTxt = 'buildings') {
  const key = `&key=${process.env.PIXABAY_API_KEY}`;
    // URL for initial API
  const protocol = `https://`;
  const host = `pixabay.com/api/`;
  const api = `${protocol}${host}?`;
    // OPTIONS for API call
  const query = `q=${encodeURIComponent(search)}`;
  const imgType = `&image_type=photo`; // all, photo, illustration, vector, Def: all
  const orin = `&orientation=horizontal` // all, horizontal, vertical, Def: all
  const cat = `&category=${catTxt}`;
              // Accepted values: backgrounds, fashion, nature, science,
              // education, feelings, health, people, religion,
              // places, animals, industry, computer, food,
              // sports, transportation, travel, buildings,
              // business, music
  //const wid = `&min_width=100`; // Default: 0
  //const high = `&min_height=100` // Default: 0
  const safe = `&safesearch=true`; // safe for all ages
  const per = `&per_page=${intRange(4, 3, 200)}`; // results/page (3 - 200) Def: 20
  const options = `${query}${imgType}${orin}${cat}${safe}${per}`
    // Final API URL
  const url = `${api}${options}${key}`
  return url
}


app.post('/forcast', dateForcast)

// API call to combine 3 api calls with data and error handling
async function dateForcast(request, response) {
  let reqHealth = true;
  const resMsg = {reqMsg: request.body, err: '', msgSts: 200}
  const dest = request.body.formText;
  const range = request.body.forRange;
  const arrRange = request.body.range;

  resMsg['geo'] = await jsonFetch(urlGeoCall(dest))
  resMsg.err = await msgErrCheck(resMsg.geo, 'geo')
  if (resMsg.err === '') {
    const latitude = resMsg.geo.data.geonames[0].lat;
    const longitude = resMsg.geo.data.geonames[0].lng;
    if (range === 1) {
      resMsg['weather'] = await jsonFetch(urlWeathCur(latitude, longitude))
    } else {
      resMsg['weather'] = await jsonFetch(urlWeathForcast(latitude, longitude, range))
    }
    resMsg.err = await msgErrCheck(resMsg.weather, 'weather');
  }
  if (resMsg.err === '') {
    let searchStr = `${dest} skyline`;
    resMsg['imgArr'] = []
    resMsg.imgArr[0] = await jsonFetch(urlPixabay(searchStr))
    resMsg.err = await msgErrCheck(resMsg.imgArr[0], 'imgArr[0]')
    if (resMsg.imgArr[0].data.total === 0 && resMsg.err === '') {
      searchStr = `airplane`;
      resMsg.imgArr[1] = await jsonFetch(urlPixabay(searchStr, 'travel'))
      resMsg.err = await msgErrCheck(resMsg.imgArr[1], 'imgArr[1]')
    }
  }
  response.status(200).send(resMsg);
}

// check if the returned value is an error
function msgErrCheck(data, txt = '') {
  if (data.err !== '') {
    return data.err;
  } else if (data.msgSts !== 200) {
    return `${txt} message error: ${data.msgSts}`;
  }else {
    return '';
  }
}


// jest testing api call
app.post('/testServer', testServer);

async function testServer(request, response) {
  const msgData = request.body;
  msgData['num'] += 1;
  response.send(msgData);
}
