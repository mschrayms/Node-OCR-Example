# Node.JS Azure Cognitive Service Optical Character Recognition (OCR) Example.

## Getting things setup
For this example to work you will need to do a few things.
1. Have an Azure account
1. Create an Azure Cognitive Services Computer Vision or Cognitive Services all in one key
1. Create a .env file with the following settings: 
 - OCRkey=this be your cognitive services computer vision key
- uribase=this will be the url for the OCR service
- readResultLimit=number of retries to read the result from the OCR Service

# Node.JS Azure Cognitive Service Optical Character Recognition (OCR) Example.

This project is a demonstration of using Azure Cognitive Services Optical Character Recognition (OCR). When prompted enter the path of an image that contains text. That will be processed and the OCR service will return back found results as text.


### Requirements
* [NodeJs](https://nodejs.org/en/)
* [Terraform](https://www.terraform.io/downloads.html) 

### Create the infrastructure needed.
This demo relies on , [Azure Computer Vision](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text#ocr-optical-character-recognition-api). Specifically you need an access key to interact with the service. You can create an [Azure Free Account](https://azure.microsoft.com/en-us/free/) to try this demo.

### Infrastructure
The infrastructure folder contains terraform files that can be used to spin up the service used by this project, Azure Computer Vision.

* Ensure that Terraform and the Azure CLI tools are installed locally or use the [Azure Cloud Shell](https://shell.azure.com) (the cloud shell installs these tools by default.)
* (if local) invoke ```az login``
* Navigate to the infrastructure repo of this folder.
* run ``` terraform init ``` to initialize terraform 
* run ``` terraform plan --out=plan.tfplan ``` 
* run ``` terraform apply "plan.tfplan" ```

Note the output values, you will be provided with the key region for the Computer Vision Resource.

* In the src folder of this repo, create a file called .env with the following structure
```
let env = {
  OCRkey : "<COMPUTER_VISION_KEY>",
  uribase: '<URI_BASE>',
  readResultLimit : '<readResultLimit>'
}
```

#### Description of Variables:
Key | Purpose
OCRkey | Cognitive services computer vision key
uribase | Url for the OCR service
readResultLimit | Number of retries to read the result from the OCR Service (optiona, defaults to 1)

### Running the Demo
* Clone the repo.
* ``` npm install ```
* ``` npm start ```


### References

* [Azure Cognitive Services OCR](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text#ocr-optical-character-recognition-api)

