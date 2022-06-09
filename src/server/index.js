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

/*
async function geoCall(text) {
  const search = encodeURIComponent(text);
  const username = process.env.GEO_NAMES_USERNAME
  const url = `http://api.geonames.org/searchJSON?q=${search}&maxRows=10&username=${username}`;
  const data = await fetch(url)
  const dataJson = await data.json();
  //console.log('geoCall: ', data);
  console.log('geoJson: ', dataJson);
};*/

//geoCall('colorado springs colorado usa')

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




/*
async function weathCurrent(lat, lon) {
  //const key = process.env.WEATHER_BIT_API_KEY;
  const h = `https://`;
  const api = `api.weatherbit.io/v2.0/current?`;
  const k = `&key=${process.env.WEATHER_BIT_API_KEY}`;
  const u = `&units=I`;
  const pos = `lat=${lat}&lon=${lon}`;
  //const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&units=I&key=${key}`
  const url = `${h}${api}${pos}${u}${k}`
  const data = await fetch(url);
  const dataJson = await data.json();
  console.log('weath Current: ', dataJson);
};*/

// New York lat lon lat=35.7796&lon=-78.6382
//weathCurrent(35.7796, -78.6382);

/*
function urlWeathCur(lat, lon) {
  const h = `https://`;
  const api = `api.weatherbit.io/v2.0/current?`;
  const k = `&key=${process.env.WEATHER_BIT_API_KEY}`;
  const u = `&units=I`;
  const pos = `lat=${lat}&lon=${lon}`;
  const url = `${h}${api}${pos}${u}${k}`
  return url
}*/

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

/*
const testUrl = urlWeathCur(35.7796, -78.6382);
console.log('testUrl: ', testUrl);*/

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
  //https://api.weatherbit.io/v2.0/forecast/daily?lat=35.7796&lon=-78.6382&units=I&days=1&key=ddff9affd7fe42e7b2c15f2e5c533ab6
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

/*
jsonFetch(urlWeathCur(35.7796, -78.6382))
  .then(jsonData => console.log('then json: ', jsonData))
  .catch(e => console.log('errJFetch1: ', e))*/

/*
  jsonFetch(urlWeathForcast(35.7796, -78.6382, 2))
    .then(jsonData => console.log('forcast json: ', jsonData))
    .catch(e => console.log('errJFetch1: ', e))*/
/*
jsonFetch(urlGeoCall('chipita park colorado usa'))
  .then(jsonData => console.log('geo data: ', jsonData))
  .catch(e => console.log('errGeoCall2', e))*/


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

//console.log('pix url: ', urlPixabay('Denver colorado skyline'));

/*
// saving files to server
jsonFetch(urlPixabay('denver colorado skyline'))
  .then(jsonData => {
    //console.log('Pix Data: ', jsonData)
    console.log('webImgUrl: ', jsonData.hits[0].webformatURL);
    console.log('webImgID: ', jsonData.hits[0].id);
    console.log('Hit Total: ', jsonData.total);
  }).catch(e => console.log('errPix1', e))*/


app.post('/forcast', dateForcast)

async function dateForcast(request, response) {
  let reqHealth = true;
  const resMsg = {reqMsg: request.body, err: ''}
  console.log('request weather forcast: ', request.body);
  const dest = request.body.formText;
  const range = request.body.forRange;
  const arrRange = request.body.range;

  /*const geoData = await jsonFetch(urlGeoCall(dest))
  resMsg['geo'] = geoData;
  resMsg.err = await msgErrCheck(geoData, 'geo');*/

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
    resMsg.err = msgErrCheck(resMsg.weather, 'weather');
  }
  if (resMsg.err === '') {
    //const cityName = resMsg.weather.data.data[arrRange].city_name;
    const cityName = resMsg.geo.data.geonames[0].name;
    let searchStr = `${cityName} ${dest} skyline`;
    resMsg['imgArr'] = []
    resMsg.imgArr[0] = await jsonFetch(urlPixabay(searchStr))
    resMsg.err = await msgErrCheck(resMsg.imgArr[0], 'imgArr[0]')
    if (resMsg.imgArr[0].data.total === 0 && resMsg.err === '') {
      searchStr = `${cityName} ${dest} skyline`;
      resMsg.imgArr[1] = await jsonFetch(urlPixabay(searchStr, 'places'))
      resMsg.err = await msgErrCheck(resMsg.imgArr[1], 'imgArr[1]')
    }
    if (resMsg.imgArr[1].data.total === 0 && resMsg.err === '') {
      searchStr = `airplane`;
      resMsg.imgArr[2] = await jsonFetch(urlPixabay(searchStr, 'travel'))
      resMsg.err = await msgErrCheck(resMsg.imgArr[2], 'imgArr[2]')
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
  console.log('initial test setup', request.body);
  const msgData = request.body;
  msgData['num'] += 1;
  console.log('msgData: ', msgData);
  response.send(msgData);
}

// temp api json data
//const geoTemp = {}
const geoTemp = {
  totalResultsCount: 10017,
  geonames: [

    {
      adminCode1: 'CO',
      lng: '-104.9847',
      geonameId: 5419384,
      toponymName: 'Denver',
      countryId: '6252001',
      fcl: 'P',
      population: 715522,
      countryCode: 'US',
      name: 'Denver',
      fclName: 'city, village,...',
      adminCodes1: [Object],
      countryName: 'United States',
      fcodeName: 'seat of a first-order administrative division',
      adminName1: 'Colorado',
      lat: '39.73915',
      fcode: 'PPLA'
    }
  ]
}
