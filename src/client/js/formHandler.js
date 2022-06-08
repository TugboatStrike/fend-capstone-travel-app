
// update date value to start with current date as default.
document.querySelector('#date').value = dateDashCur();





function handleSubmit(event) {
    event.preventDefault()
    const formInfo = {};

    // check what text was put into the form field
    const formText = document.getElementById('name').value

    const formDate = document.getElementById('date').value

    formInfo['formText'] = formText;
    formInfo['formDate'] = formDate
    //const dateObj = new Date(formDate.replace(/-/g, '\/'));
    const dateObj = getDate(formDate);
    /*
    const strDate = dateObj.toLocaleString('en-US', { year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday: 'long'
                                                      });*/
    const strDate = dateLong(dateObj);
    const jsonDate = dateObj.toJSON();

    console.log('created form info: ', formInfo);
    getForcast(formInfo);
    //const todayTest = new Date();

    //console.log('date Range: ', dateRange(formDate, 0, 15));
    //console.log('api forcast: ', dateRange(formDate, 0, 15)+1);
    //console.log('string date: ', strDate);
    //console.log('json date: ', jsonDate);

    //console.log('formText: ', formText);
    Client.checkForName(formText)

    addCard('https://placebear.com/200/300', strDate, 'creation');


/*
    getSentiment(createJson(formText))
      .then(anotherRes => {
        // updateResults(anotherRes, formText);
        console.log('anotherRes: ', anotherRes);
        // checking code status
        const code = (anotherRes.status.code != 0);
        // checking for undefined agreement
        const defined = (anotherRes.agreement === undefined);
        // checking for scored value
        const scoreDefined = (anotherRes.score_tag === 'NONE');
        if (code) {
          //alert(`err code: ${anotherRes.status.code}
//${anotherRes.status.msg}`);
        //  };

        }else if (defined) {
          //alert('Please enter a different value')
        }else if (scoreDefined) {
          //alert('Entered Value could not be scored')
        };
        //}else {
        //  updateResults(anotherRes, formText);
        //};


        return anotherRes;
      }).catch(e => console.log('errResult1', e))
      */

    console.log("::: Form Submitted :::")
    fetch('http://localhost:8080/test')
    .then(res => res.json())
    .then(function(res) {
        console.log('skipping msg: ', res.message);
        //document.getElementById('results').innerHTML = res.message
    })
}

export { handleSubmit }


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
    //const url = ''
    console.log('the  data : ',  data );
    const response = await fetch('/sentiment', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin',  // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    const jsonResponse = await response.json();
    //console.log('json res from server: ', jsonResponse);
    return jsonResponse;
}

// creating server API
// 0) determine message options to be used
// 1) create server call with simple log to be triggered
// 1.1) create function to be called by api message
// 2) create client call to api to trigger api call only for log check
// 3) client side add body with empty message
// 4) server side make sure api still triggers
// 5) server side display the message
// 6) client side add something to empty message
// 6.1) note this required body: JSON.stringify(<json object>)
// 7) server log message when recieved
// 7.1) note this just needs request.body to display message
// 7.2) server does require app.use(bodyParser.json()); as middleware
// 7.3) bodyParser.json allows server to read message. doesn't effect api call
// 8) server side create response and send back to Client
// 9) client side recieve response
// 10) client side convert to readable formate like json
// 11) client side display message response data
async function getForcast(jsonData = {}) {
  console.log('getting forcast');
  const options = {method: 'POST',// *GET, POST, PUT, DELETE, etc.
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                    //body: jsonData
                  }
  const response = await fetch('/forcast', options)
  const jsonRes = await response.json();
  console.log('forcast fetch done!!!', jsonRes);
  return jsonRes;
}

//getForcast()


async function testServer(num = 1) {
  console.log('Testing Server running');
  const msgData = {num: num}
  const options = {method: 'POST',// *GET, POST, PUT, DELETE, etc.
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(msgData)
                  }
  const response = await fetch('/test', options)
  const jsonRes = await response.json();
  console.log('server test done!!!', jsonRes);
  return jsonRes['num'];
}

console.log('testServer 3: ', testServer(3));

export { testServer }


function updateResults(jsonData, textRes) {
  const text = textRes;
  const sent = jsonData.agreement;
  const conf = jsonData.confidence;
  const tag = jsonData.score_tag;
  const resaultMsg = String.raw`Sentiment: ${sent} | Confidence: ${conf} | Score Tag: ${tag}

  || Text being checked:
  ${text}`;
  document.getElementById('results').innerHTML = resaultMsg;
}

// checks if text is a url starting with http. bool reply
function isUrl(text) {
  const regex = /http/;
  const result = regex.test(text);
  //console.log("regex: ", result);
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
  //}else if (initValue != value && value!==min && value!==max) {
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

/*
addCard('https://placebear.com/200/300', newDate, 'some text different');
addCard('https://placebear.com/200/300', newDate, 'card 2');
addCard('https://placebear.com/200/300', newDate, 'card 3');
addCard('https://placebear.com/200/300', newDate, 'card 4');
addCard('https://placebear.com/200/300', newDate, 'card 5');
*/

/*
const cardList = document.querySelectorAll('.card');
console.log('card list: ', cardList);
console.log('card list len: ', cardList.length);
cardList[0].remove();
console.log('card list: ', cardList);
const cardList2 = document.querySelectorAll('.card');
console.log('card list2: ', cardList2);
*/
