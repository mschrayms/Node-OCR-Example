## Node.JS Azure Cognitive Service Optical Character Recognition (OCR) Example.

This project is a demonstration of using Azure Cognitive Services Optical Character Recognition (OCR). When prompted enter the path of an image that contains text. That will be processed and the OCR service will return back found results as text.


### Requirements
* [NodeJs](https://nodejs.org/en/)

### Create the infrastructure needed.
This demo relies on , [Azure Computer Vision](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text#ocr-optical-character-recognition-api). Specifically you need an access key to interact with the service. You can create an [Azure Free Account](https://azure.microsoft.com/en-us/free/) to try this demo.

### Configure Access key
* In the src folder of this repo, create a file called .env with the following structure
```
OcrKey="<COMPUTER_VISION_KEY>"
UriBase='<URI_BASE>'
ReadResultLimit='<readResultLimit>'

```

#### Description of Variables:
|Key              | Purpose                                                                            |
|-----------------|------------------------------------------------------------------------------------|
| OcrKey          | Cognitive services computer vision key                                             |
| UriBase         | Url for the OCR service                                                            |
| ReadResultLimit | Number of retries to read the result from the OCR Service (optional, defaults to 3) |

### Running the Demo
* Clone the repo.
* ``` npm install ```
* ``` npm start ```


### References

* [Azure Cognitive Services OCR](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text#ocr-optical-character-recognition-api)

