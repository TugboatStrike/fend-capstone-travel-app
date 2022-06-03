function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value
    //console.log('formText: ', formText);
    Client.checkForName(formText)



    getSentiment(createJson(formText))
      .then(anotherRes => {
        updateResults(anotherRes, formText);
        console.log('anotherRes: ', anotherRes);
        // checking code status
        const code = (anotherRes.status.code != 0);
        // checking for undefined agreement
        const defined = (anotherRes.agreement === undefined);
        // checking for scored value
        const scoreDefined = (anotherRes.score_tag === 'NONE');
        if (code) {
          alert(`err code: ${anotherRes.status.code}
${anotherRes.status.msg}`);
        //  };

        }else if (defined) {
          alert('Please enter a different value')
        }else if (scoreDefined) {
          alert('Entered Value could not be scored')
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
