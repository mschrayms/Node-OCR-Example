/*jshint strict:false */
"use strict"; 

const result = require('dotenv').config();
var rp = require('request-promise');

if (result.error) {
    throw result.error;
}
   
console.log(result.parsed);

 function sleep(ms){
     return new Promise(resolve=>{
         setTimeout(resolve,ms);

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

async function getOperationStatus(url) {

    console.log("wiat 1");
    await sleep(1000);
    console.log("wiated 1");

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    var amIDone=false;
    var isDone=false;
    var bodyJson="";

    await request.get(url,options,function(err,textResponse,body){
    //     if (err) console.log("getTextOperationLocation failed"+err);

        
        if (textResponse.statusCode === 200) {
             amIDone =  JSON.parse(body).status;
             isDone = /Succeeded/i.test(amIDone);
             bodyJson = body;
             console.log(bodyJson);
             return bodyJson;
         }

    });

  }

async function sendFileToRecognizeText() {

    // Request parameters. 
    // The language parameter doesn't specify a language, so the 
    // method detects it automatically.
    // The detectOrientation parameter is set to true, so the method detects and
    // and corrects text orientation before detecting text.
    // mode can be Printed or Handwritten
    var mode="Printed";
    var requestParameters = `mode=${mode}`;

    var options = {
        method: 'POST',
        uri: `${uriBase}?${requestParameters}`,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        },
        resolveWithFullResponse: true ,
        json: false // Automatically stringifies the body to JSON
    }
    
    await rp.post(options).then (function (details){
        return getOperationStatus(details.headers["operation-location"]);
    });

    // rp(options)
    //     .then(function (parsedBody) {
    //         // POST succeeded...
    //         console.log("here");

    //         // this is the location of the service to be called
    //         return getOperationStatus(parsedBody.headers["operation-location"]);

    //     })
    //     .catch(function (err) {
    //         console.log("here"+err);
    //         // POST failed...
    //     });

        console.log("wait 3");
        //await sleep(1000);
        console.log("waited 3");

    // request.post(options, (error, response, body) => {
    //     if (error) {
    //         console.log('Error: ', error);
    //        return;
    //     }
    
    //     // our request was accepted, but we need to wait for the OCR operation to be completed
    //     if (response.statusCode === 202)
    //     {
    //         // get the url of the operation-location which is the OCR activity is happening
    //         var operationLocation = response.headers["operation-location"];
    
    //         return operationLocation;
    //     }
    //     console.log("the results is "+result);
    // });
}

console.log(sendFileToRecognizeText());