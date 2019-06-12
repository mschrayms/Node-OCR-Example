'use strict';

const result = require('dotenv').config();

if (result.error) {
    throw result.error;
  }
   
  console.log(result.parsed);

  async function init(){
    console.log(1)
    await sleep(1000)
    console.log(2)
 }
 function sleep(ms){
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
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


// Request parameters. 
// The language parameter doesn't specify a language, so the 
// method detects it automatically.
// The detectOrientation parameter is set to true, so the method detects and
// and corrects text orientation before detecting text.
// mode can be Printed or Handwritten
var mode="Printed";
var requestParameters = `mode=${mode}`;

const options = {
    uri: `${uriBase}?${requestParameters}`,
    //qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

// send the image to the API for processing
request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }

  // our request was accepted, but we need to wait for the OCR operation to be completed
  if (response.statusCode === 202)
  {
      // get the url of the operation-location which is the OCR activity is happening
    var operationLocation = response.headers["operation-location"];
    var count = 0;
    var limit =10;
    var result="";
    do {

        count++;
        result  = getOperationStatus(operationLocation);

        if (!/running/i.test(result) || !/notstarted/i.test(result) || /""/i.test(result) && (count<=limit) )
        {
            console.log("Entered the delay function: " +count);
            setTimeout(getOperationStatus,1000);
        }
        else {

        }
    
        // if (!isDone)
        // {
        //    throw "Unable to retrieve result from Cognitive Services OCR";
        // }
    } while (!/running/i.test(result) || !/notstarted/i.test(result) || (count>=limit) );
    console.log("Exited do while");
  } else {
      throw `Unable to complete RecognizeText request${response.statusMessage}`;
  }

  function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    })
}

  function getOperationStatus(url) {

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    var amIDone=false;
    var isDone=false;
    var bodyJson="";

    var operationResult = request.get(url,options,function(err,textResponse,body){
        if (err) console.log("getTextOperationLocation failed"+err);

        if (textResponse.statusCode === 200) {
            var amIDone =  JSON.parse(body).status;
            isDone = /Succeeded/i.test(amIDone);
            bodyJson = body;
            console.log(bodyJson);
        }

    });

    return isDone ? bodyJson : (bodyJson === "") ?  "" : JSON.parse(body).status;
  }

  //let responseDetails = JSON.parse(response.toJSON());
  //var hold = response.operation-location;
  ///let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  //console.log('JSON Response\n');
  //console.log(jsonResponse);
});