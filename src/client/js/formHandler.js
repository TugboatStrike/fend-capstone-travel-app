
// update date value to start with current date as default.
document.querySelector('#date').value = dateDashCur();





function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    const formText = document.getElementById('name').value

    const formDate = document.getElementById('date').value
    const dateObj = new Date(formDate.replace(/-/g, '\/'));
    const strDate = dateObj.toLocaleString('en-US', { year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday: 'long'
                                                      });
    const jsonDate = dateObj.toJSON();


    const todayTest = new Date();

    console.log('date Range: ', dateRange(formDate, 0, 15));
    console.log('api forcast: ', dateRange(formDate, 0, 15)+1);
    console.log('string date: ', strDate);
    console.log('json date: ', jsonDate);

    //console.log('formText: ', formText);
    Client.checkForName(formText)

    addCard('https://placebear.com/200/300', strDate, 'creation');



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
        /*}else {
          updateResults(anotherRes, formText);
        };
        */

        return anotherRes;
      }).catch(e => console.log('errResult1', e))

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


function isUrl(text) {
  const regex = /http/;
  const result = regex.test(text);
  console.log("regex: ", result);
  return result;
}


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

const today = `${Date()}`
console.log('today date: ', today);

let d = new Date();
let newDate = (d.getMonth()+1) +'.'+ d.getDate()+'.'+ d.getFullYear();
console.log('newDate: ', newDate);

function dateRange(dateData, min, max) {
  const oneDay = 1000 * 60 * 60 * 24;
  // Dashes and Slashes give diffrent results. by converting to just the day
  // date and then creating the date again the times will match up for diff
  const dateInfo = new Date(dateData.replace(/-/g, '\/'));
  const todayDate = new Date(dateDashCur().replace(/-/g, '\/'));
  let dateDiff = (dateInfo - todayDate)/oneDay;

  //console.log('convert date entry: ', dateInfo, ' time: ', dateInfo.getTime());
  //console.log('today date entry: ', todayDate, ' time: ', todayDate.getTime());
  //console.log('days diff: ', dateDiff);

  //const dateInfo = new Date(formDate);


  //const todayDate = new Date(dateDashCur());


  //console.log('date: ', formDate);
  //console.log('today date: ', dateDashCur());
  return dateDiff;
}

// takes date as string and converts to date object
// if string is valid date it will return the string date else it returns
// current date if invalid string.
function getDate(strDate) {
  let iniTest = new Date(strDate.replace(/-/g, '\/'));
  let dateObj = new Date();
  //console.log('given string: ', strDate);
  if (iniTest.toString() !== "Invalid Date" && !isNaN(iniTest)) {
    dateObj = iniTest;
    //console.log('date string good: ', dateObj);
  }
  return dateObj;
}

console.log('test 1: ', getDate('stringTest'));
console.log('test 2: ', getDate('05/11/2022'));
console.log('test 3: ', getDate('05-11-2022'));
//console.log('test 0: ', Object.prototype.toString.call(new Date('aString')));
//console.log('test 0.1: ', Object.prototype.toString.call(new Date('aString'))==="[object Date]");
//const testDateObj = new Date('aString')
//console.log('test 0.2: ', testDateObj.toString());
//console.log('test 0.2: ', testDateObj.toString()!== "Invalid Date");
//console.log('test 1: ', (new Date('aString').toString() !== "Invalid Date"));
//console.log('test 2: ', (new Date('5-11-2022').toString() !== "Invalid Date"));
//console.log('test 3: ', (new Date('5/11/2022').toString() !== "Invalid Date"));
//console.log('test 4: ', !isNaN(testDateObj));
//console.log('test 5: ', !isNaN(new Date('5-11-2022')));

function dateDashCur() {
  const d = new Date();
  const year = addZero(d.getFullYear(),4);
  const month = addZero((d.getMonth()+1));
  const day = addZero(d.getDate());
  //const todayDate = `${year}-${month}-${day}`;
  //return todayDate;
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
