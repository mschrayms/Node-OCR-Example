'use strict';

const result = require('dotenv').config();
var rp = require('request-promise');

if (result.error) {
    throw result.error;
}
   
console.log(result.parsed);
 
const request = require('request');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms);

    })
}

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

let res =null;
//let handler = null;
async function getOperationStatus(url) {
    return new Promise(async function(fulfil,reject) {
        //if(handler == null)handler=fulfil;
        console.log("wiat 1");
        //await sleep(1000);
        console.log("wiated 1");
    
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };

        await rp.get(url,options).then(function (data) {
          let status = JSON.parse(data).status;
          console.log(status);
          if(/running/i.test(status) || /notstarted/i.test(status)){
            return setTimeout( function(){
              getOperationStatus(url)
            },1000);
          }
          else {
              console.log("done with retrieve"+data+"\n");
              res=data;
              return fulfil(res);
          }
        });
    });
}

async function sendFileToRecognizeText() {
    return new Promise(async function (fulfil,reject) {
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
            //Promise.resolve(details);
            fulfil(details.headers["operation-location"]);
            //return getOperationStatus(details.headers["operation-location"]);
    
        });
    });
 
}

//console.log(sendFileToRecognizeText());
sendFileToRecognizeText().then(function (data) {
    console.log(data);    

    var state="";
    //do {
        //if (/running/i.test(state)||state==="") sleep(1000);
        getOperationStatus(data).then(function(data1){
            console.log("DATA1"+data1);
            //state=JSON.parse(data1).status;
        });    
    //} while (/running/i.test(state) || state==="");

}); 


    
