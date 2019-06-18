/*jshint esversion: 6 */
'use strict';
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
const env = require('dotenv').config({ path: ENV_FILE });
const fs = require('fs');
const inquirer =require("inquirer");

const { OCR } = require("./CognitiveServicesOCR");
const ocr = new OCR({
        subscriptionKey : process.env.OCRkey,
        uriBase : process.env.uribase,
        readResultLimit :  process.env.readResultLimit
    }
);

async function getFileName() {
    let filename="";
    
    const questions = [{
        type: 'string',
        name: 'filename',
        message: "What's the path and filenname of the image for the OCR service?",
      }];
      
      filename = await inquirer.prompt(questions);
      console.log(filename);
    
    return filename["filename"];
}

async function main() {

    const infile = await getFileName();
 
    if ( fs.existsSync(infile) ) {
        // Do OCR on the inbound file name
        ocr.recognizeText(infile).then( function (data) {
            const text = ocr.getAllText(data);
            console.log(`Text returned from the image is:\n ${text}`);
        });
    }
    else {
        console.error(`\n${infile} doesn't seem to exist.  Try again.`)
    }

    
}

main();