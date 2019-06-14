'use strict';
const result = require('dotenv').config();

const { recognizeText, getAllText } = require("./CognitiveServicesOCR");

recognizeText("./parking.jpg").then(function (data) {
    console.log(getAllText(data));
});
