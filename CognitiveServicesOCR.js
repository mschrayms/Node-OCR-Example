/*jshint esversion: 6 */
const result = require('dotenv').config();

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.OCRkey;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
// for example: https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze
const uriBase = process.env.uribase;

const requestPromise = require('request-promise');
var fs = require('fs');

function sleep(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}

// Part 1 of the API send a file to aysncBatchAnalyze - this returns service-location which is the url
// part 2 uses to get the results
async function sendFileToRecognizeText(binary) {
    let mode = "Printed";
    let requestParameters = `mode=${mode}`;
    let options = {
        method: 'POST',
        uri: `${uriBase}?${requestParameters}`,
        //    body: '{"url": ' + '"' + imageUrl + '"}',
        body: binary,
        headers: {
            //'Content-Type': 'application/json',
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        },
        resolveWithFullResponse: true,
        json: false // Automatically stringifies the body to JSON
    };
    return requestPromise.post(options);
}
// part 2 uses the operation-location (e.g. url) from part 1 to get the results
async function getOperationStatus(url) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    return requestPromise.get(url, options);
}
function getAllText(data) {
    return data.recognitionResults[0].lines.reduce((accum, item) => {
        let result = accum.text ? accum.text : accum;
        return `${result}\n ${item.text}`;
    });
}
exports.getAllText = getAllText;
//this is just a constant to avoid hard coded strings
const STATUS = {
    SUCCEEDED: 'Succeeded',
    FAILED: 'Failed',
    RUNNING: 'Running',
    NOT_STARTED: 'NotStarted'
};
async function recognizeText(file) {
    var binary = await fs.readFileSync(file);
    let response = await sendFileToRecognizeText(binary);
    let url = response.headers["operation-location"];
    let status = "notstarted";
    let data;
    let counter = 1;

    // is it running or notstarted or have we given it enough attempts and should fail out
    while (/running/i.test(status) || /notstarted/i.test(status || counter < process.env.readResultLimit)) {
        await sleep(1000 * counter++); // wait for operation to complete 
        let json = await getOperationStatus(url);
        data = JSON.parse(json);
        status = data.status;
    }
    switch (data.status) {
        case STATUS.SUCCEEDED:
            return data;
            break;
        case STATUS.NOT_STARTED:
        case STATUS.FAILED:
            console.log('fail');
            break;
    }
}
exports.recognizeText = recognizeText;
