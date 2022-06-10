

async function handleSubmit(event) {
    event.preventDefault()
    let submitHealthy = true;
    const formInfo = {err: ''};
    let resForcast = {};

    // check what text was put into the form field
    const formText = document.getElementById('name').value
    const formDate = document.getElementById('date').value

    if (submitHealthy) {
      if (formText) {
        displayText(`Traveling to ${formText}`)
        const dateObj = getDate(formDate);
        const strDate = dateLong(dateObj);
        const forcastRange = dateRange(formDate, 0, 15);
        // Add data to the form object
        formInfo['formText'] = formText;
        formInfo['formDate'] = formDate;
        formInfo['range'] = forcastRange;
        formInfo['forRange'] = forcastRange+1;
        formInfo['dateObj'] = dateObj;
        formInfo['dateLong'] = strDate;
        resForcast = await getForcast(formInfo);
        formInfo.err = await msgErrCheck(resForcast, 'serverReply')

        if (formInfo.err === '') {
          formInfo.err = await msgErrCheck(resForcast.data, 'apiReplies')
        }
      }else {
        displayText(`Please enter a destination`)
        submitHealthy = false;
        formInfo.err = 'Error: No text to search for Destination'
      };
    };
    if (formInfo.err === '') {
      const imgUrl = parseImg(resForcast.data);
      const weather = ` The weather should be ${parseWeather(resForcast.data)}`;
      const destination = `Traveling to ${formInfo.formText}.`;
      const textDisplay = `${destination}${weather}`;
      addCard(imgUrl, formInfo.dateLong, textDisplay);
    }else {
      displayText('Search request could not be completed at this time!')
    }
}

export { handleSubmit }

// parse img url from recieved data
function parseImg(data = {}) {
  const elementUsed = data.imgArr.length -1;
  const url = data.imgArr[elementUsed].data.hits[0].previewURL;
  return url
}

function parseWeather(data = {}) {
  const elementUsed = data.weather.data.data.length -1;
  let temp = '';
  if (elementUsed == 0) {
    temp = data.weather.data.data[elementUsed].app_temp;
  } else {
    temp = data.weather.data.data[elementUsed].temp;
  };
  const description = data.weather.data.data[elementUsed].weather.description;
  return `${temp} fahrenheit with ${description}.`
}


// create a json object dictionary with data as the key word.
function createJson(text) {
    const urlSts = isUrl(text);
    const objectJson = {
      data: text,
      is_url: urlSts,
    };
    return objectJson
}


// data must be json format
async function getSentiment( data){
    const response = await fetch('/sentiment', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin',  // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    const jsonResponse = await response.json();
    return jsonResponse;
}

// api call to the server to get the forecast.
async function getForcast(jsonData = {}) {
  const options = {method: 'POST',// *GET, POST, PUT, DELETE, etc.
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                  }
  const response = await jsonFetch('/forcast', options)
  return response;
}

// api call to the server to test api calls working
async function testServer(num = 1) {
  console.log('Testing Server running');
  const msgData = {num: num, err: ''}
  const options = {method: 'POST',// *GET, POST, PUT, DELETE, etc.
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(msgData)
                  }
  const response = await jsonFetch('/testServer', options)
  const errCheck = msgErrCheck(response, 'testServer')
  const getRes = await jsonFetch('/test')
  const getErr = msgErrCheck(getRes, 'getTest')
  if (response.err === '') {
    return response.data.num;
  } else {
    return response;
  }
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

// Fetch with data conversion to json with error handling
async function jsonFetch(url, options = {}) {
  let dataJson = {err: '',
                  msgSts: '',
                  data: {}
                  }
  await fetch(url, options)
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

// display text on the html display information for the user
function displayText(text) {
  document.getElementById('results').innerHTML = text;
}

// initilize the form with starting values like the current day date
function initForm() {
  document.querySelector('#date').value = dateDashCur();
  //document.querySelector('#name').value = 'Denver Colorado usa';
  displayText('Welcome, Please enter a travel destination.');
  //testServer(3);
}

export {initForm}


// checks if text is a url starting with http. bool reply
function isUrl(text) {
  const regex = /http/;
  const result = regex.test(text);
  return result;
}

// uses the generated card function and adds the element to the dom
// !!!!! this should be changed to except any element and add it to dom
function addCard(picUrl = 'https://placebear.com/200/300', date, text = '') {
  const cardList = document.querySelectorAll('.card');
  const cardB = document.getElementById("cardBox");
  const card = genCard(picUrl, date, text);
  // Check for card limit and remove oldest fifo
  if (cardList.length >= 3) {
    cardList[0].remove();
    cardB.appendChild(card);
  }else {
    cardB.appendChild(card);
  }
}

// generates card as element.
function genCard(picUrl = 'https://placebear.com/200/300', date, text = '') {
  let cardGen = document.createElement('div')
  cardGen.innerHTML = `<a href="#" class="card">
    <img src=${picUrl} class="card__image" alt="brown couch" />
    <div class="card__content">
      <time datetime="2021-03-30" class="card__date">${date}</time>
      <span class="card__title">${text}</span>
    </div>
  </a>`;
  return cardGen.firstChild
}


// checks date is within range of days. returns min / max or days from currnt
function dateRange(dateData, min = 0, max = 100) {
  const oneDay = 1000 * 60 * 60 * 24;
  min = parseInt(min);
  max = parseInt(max);
  if ( isNaN(max)) {
    max = 100;
  }
  if ( isNaN(min)) {
    min = 0;
  }
  // Dashes and Slashes give diffrent results. by converting to just the day
  // date and then creating the date again the times will match up for diff
  const dateInfo = getDate(dateData);
  const todayDate = getDate(dateDashCur());
  const dateDiff = (dateInfo - todayDate)/oneDay;
  const rangeDays = intRangeUp(dateDiff, 0, 15);
  return rangeDays;
}

// convert date to be written out in the long format
function dateLong(dObj) {
  const options = { year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  };
  const lang = 'en-US';

  return dObj.toLocaleString(lang, options);
}


// check if value is an intiger and within range of values as intiger.
// this also rounds any float numbers up instead of truncating them.
// because date obj times can be off not all difference divisions
// will be exact. P.S. can i find a bigger hammer?
function intRangeUp(value, min=0, max=100) {
  const initValue = value;
  let notChanged = true;
  min = parseInt(min);
  max = parseInt(max);
  if ( isNaN(max)) {
    max = 100;
  }
  if ( isNaN(min)) {
    min = 0;
  }
  if ( isNaN(value)) {
    value = min
    notChanged = false;
  }else if (value < min) {
    value = min;
    notChanged = false;
  }else if (max < value) {
    value = max;
    notChanged = false;
  }
  value = parseInt(value); // truncating any floats
  if (initValue != value && notChanged) {
    // assume value to round up
    value += 1;
  }
  return value;
};



// takes date as string and converts to date object
// if string is valid date it will return the string date else it returns
// current date if invalid string.
function getDate(strDate = '') {
  let iniTest = new Date(strDate.replace(/-/g, '\/'));
  let dateObj = new Date();
  if (iniTest.toString() !== "Invalid Date" && !isNaN(iniTest)) {
    dateObj = iniTest;
  }
  return dateObj;
}


// Get current date in dash format used primarily for html input value
function dateDashCur() {
  const d = getDate();
  const year = addZero(d.getFullYear(),4);
  const month = addZero((d.getMonth()+1));
  const day = addZero(d.getDate());
  return `${year}-${month}-${day}`;
}

// adds zero's to the string until the expected length is reached.
function addZero(numStr, len=2) {
  numStr = numStr.toString(); // consvert to string
  while (numStr.length < len) {
    numStr = '0' + numStr;
  }
  return numStr
};
