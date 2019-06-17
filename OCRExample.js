/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const result = require('dotenv').config();

const inquirer =require("inquirer");

const { recognizeText, getAllText } = require("./CognitiveServicesOCR");

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

    // get this input filename
    var infile = await getFileName();
 
    if (fs.existsSync(infile)) {
        // Do OCR on the inbound file name
        recognizeText(infile).then(function (data) {
            console.log("Text returned from the image is:\n");
            console.log(getAllText(data));
        });
    }
    else {
        console.error(`\n${infile} doesn't seem to exist.  Try again.`)
    }

    
}

main();