'use strict';

const result = require('dotenv').config();
var rp = require('request-promise');

if (result.error) {
  throw result.error;
}

const request = require('request');


// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.OCRkey;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = process.env.uribase;
//'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/' +
  'Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png';

// Request parameters.
const params = {
  'language': 'unk',
  'detectOrientation': 'true',
};

// function sleep(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);

//   })
// }


function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}

async function sendFileToRecognizeText() {
  let mode = "Printed";
  let requestParameters = `mode=${mode}`;

  let options = {
    method: 'POST',
    uri: `${uriBase}?${requestParameters}`,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    },
    resolveWithFullResponse: true,
    json: false // Automatically stringifies the body to JSON
  }
  return rp.post(options);
}

async function getOperationStatus(url) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  };
  return rp.get(url, options);
}

function getAllText(data){
  return data.recognitionResults[0].lines.reduce((accum,item) => {
    let result = accum.text ? accum.text : accum; 
    return `${result}\n ${item.text}`;
  });
}
//this is just a constant to avoid hard coded strings
const STATUS ={
  SUCCEEDED: 'Succeeded',
  FAILED : 'Failed',
  RUNNING: 'Running',
  NOT_STARTED: 'NotStarted'
}

async function main(){
  
  let response = await sendFileToRecognizeText();

  let url = response.headers["operation-location"]
  let status = "notstarted";
  let data;
  let counter =1,limit=10;

  while (/running/i.test(status) || /notstarted/i.test(status || counter<limit)) {
    await sleep(1000*counter++);
    let json = await getOperationStatus(url)
    data = JSON.parse(json);
    status = data.status;
  }
// probably should deal with case differences?

  if(/STATUS.SUCCEEDED/i.test(data.status)){
    console.log(`It works!`);
    console.log(getAllText(data));
  }

  //I woul do it this way, instead of regex
  // why?  Faster?  
// slightly and no need for regex since the status options are a fixed predefined list.
  switch(data.status){
    case STATUS.SUCCEEDED:
      console.log('it works');
      console.log(getAllText(data));
      break;

    case STATUS.FAILED:
      console.log('fail');
      break;
    
  }
 

}

main();


