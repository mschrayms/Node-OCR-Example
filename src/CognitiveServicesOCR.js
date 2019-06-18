/*jshint esversion: 6 */
const requestPromise = require('request-promise');
const fs = require('fs');

const STATUS = {
    SUCCEEDED: 'Succeeded',
    FAILED: 'Failed',
    RUNNING: 'Running',
    NOT_STARTED: 'NotStarted'
};


class OCR {
    constructor(options) {
        this.subscriptionKey = options.subscriptionKey;
        this.uriBase = options.uriBase;
        this.readResultLimit =  options.readResultLimit || 1;
    }

    sleep(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        });
    }

    // Part 1 of the API send a file to aysncBatchAnalyze - this returns service-location which is the url
    // part 2 uses to get the results
    async sendFileToRecognizeText(binary) {
        let mode = "Printed";
        let requestParameters = `mode=${mode}`;
        let options = {
            method: 'POST',
            uri: `${this.uriBase}?${requestParameters}`,
            body: binary,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey
            },
            resolveWithFullResponse: true,
            json: false // Automatically stringifies the body to JSON
        };
        return requestPromise.post(options);
    }
    // part 2 uses the operation-location (e.g. url) from part 1 to get the results
    async getOperationStatus(url) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey
            }
        };
        let json = await requestPromise.get(url, options);
        return JSON.parse(json);
    }

    getAllText(data) {
        return data.recognitionResults[0].lines.reduce((accum, item) => {
            let result = accum.text ? accum.text : accum;
            return `${result}\n ${item.text}`;
        });
    }

    async recognizeText(file) {
        const binary = await fs.readFileSync(file);
        const response = await this.sendFileToRecognizeText(binary);
        const url = response.headers["operation-location"];
        let status = "notstarted";
        let data;
        let counter = 1;

        // is it running or notstarted or have we given it enough attempts and should fail out
        while (/running/i.test(status) || /notstarted/i.test(status || counter < this.readResultLimit)) {
            await this.sleep(1000 * counter++); // wait for operation to complete 
            data = await this.getOperationStatus(url);
            status = data.status;
        }
        switch (data.status) {
            case STATUS.SUCCEEDED:
                return data;
                break;
            case STATUS.NOT_STARTED:
            case STATUS.FAILED:
                throw Error(`OCR Failed ${data.status}`);
                break;
        }
    }
}

exports.OCR = OCR;
