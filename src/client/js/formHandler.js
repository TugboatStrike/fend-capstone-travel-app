//const formDateValue = document.querySelector('#date');
//formDateValue.value = dateCurrent();

document.querySelector('#date').value = dateCurrent();



function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value

    let formDate = document.getElementById('date').value
    console.log('date: ', formDate);
    console.log('today date: ', dateCurrent());
    console.log('date Range: ', dateRange(formDate));
    //console.log('formText: ', formText);
    Client.checkForName(formText)

    addCard('https://placebear.com/200/300', formDate, 'creation');



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


function genCard(picUrl2 = 'https://placebear.com/200/300', date2, text2 = '') {
  let cardGen = document.createElement('div')
  cardGen.innerHTML = `<a href="#" class="card">
    <img src=${picUrl2} class="card__image" alt="brown couch" />
    <div class="card__content">
      <time datetime="2021-03-30" class="card__date">${date2}</time>
      <span class="card__title">${text2}</span>
    </div>
  </a>`;
  return cardGen.firstChild
}

const today = `${Date()}`
console.log('today date: ', today);

let d = new Date();
let newDate = (d.getMonth()+1) +'.'+ d.getDate()+'.'+ d.getFullYear();
console.log('newDate: ', newDate);

function dateRange(dateData) {
  console.log('date range: ');
}

function dateCurrent() {
  const d = new Date();
  //const todayDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  const todayDate = `${d.getFullYear()}-06-07`;
  return todayDate;
}

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



function addZero(numStr, len=2) {
  while (numStr.length< len) {
    numStr = '0'+numStr
  }
  return numStr
}

let stringTest = '1'
console.log('initial string: ', stringTest);
stringTest = addZero(stringTest);
console.log('after string: ', stringTest);
