# Thinkerless: a serverless handling application

![Logo](https://github.com/Warkanlock/thinkerless/blob/main/docs/branding/cover.png)

### What's Thinkerless?

Is a dynamic endpoint generator that contain **security**, **validation**, **multiple contexts**. All of this built-in as an Azure Function, that help us to build an endpoint with no more than a extension file. This idea provide flexibility and easy maintainability in terms of CI/CD endpoint generation without worry in terms of scalability.

In order to replicate and start using this framework you have to clone the content from the intent-handler or example-handler folder and **modify it according to your needs**

### Features

- **Built-in security**
- **Auto-scale functionality**: Auto-create endpoints using a CI/CD pipeline on each PR refering to a resource group.
- **No code to maintain, only extension handlers**: You don't need to worry on validation, security and other issues. Only thing needed it's an extension file.
- **Global validation schema**: Only file to rule them all.
- **Easy cross-team maintaince:** Each team could work on each extension handler, without need to worry about other changes.

### Installation

To install this repository in your local machine you have to run the following commands:

1. `npm install -g azure-functions-core-tools`

2. On the extensions tab of Visual Studio Code, install the 'Azure Functions' extension.

Once everything is installed, **just run**:

`npm start`

### Folder Structure

Follow these rules for the purpose of maintaining the order on the repository:

![folder structure](https://github.com/Warkanlock/thinkerless/blob/main/docs/folder_structure.png)

### How to define the generic

#### Common Information about name convention

- CreateContext > In charge of convert a raw incoming JSON into a more robust information needed for the Intent Handler.
- LogicHandler > Logic related to the managenment of each intent-name behavior.
- functionHandler > Summatory of everything else. You have to declare and write your _API fetch or Information fetch logic here._

#### How to create a new intent handler based on the one we have

In order to create your own Intent Handlers follow these instructions:

1. First of all, you have to run

`func new --template "Http Trigger" --name YourAzureFunctionNam --typescript`

Note: don't create an environment using `func init` because that's already done.

2. Second, you will have a folder structure like the following one:

![function structure](https://github.com/Warkanlock/thinkerless/blob/main/docs/function_structure.png)

3. The main file is index.js. Over there you have to create your context using the **CreateContext** function (/utils/callers). To do so, you only have to pass your request object and context object into the parameters and that's it. You will receive a **contextIntent** which is an object containing a relationship with the intent called.

4. You have to extend the **_LogicHandler_** class, which is a Handler to provide accesibility across all the functions.
   In order to do so, you have to declare a class whose hierarchy comes from the LogicHandler object. Then, create all the needed methods related to the action name provided by the Intent Handler.

5. Deploy that function using CI/CD to the Azure Resource or deploy your Azure Function locally using `npm start`.

## Customize your intent handler

1. Run the following command to create your azure funtion

`func new --template "Http Trigger" --name AzureFunctionExample --typescript`

2. On the function.json file (inside the created folder) add the following line:

`"route": "azureFuntionExample/{intent_category}/{intent_action}"`

This step is necessary to maintain the api route structure. The function.json file should look like this:

![function_route](https://github.com/Warkanlock/thinkerless/blob/main/docs/function_route.png)

3. On the extensions folder (inside utils folder) create a new file to extend the LogicHandler class.
   This step is necessary to maintain the multi platform feature, so avoid creating the new extension on the azure function folder.

Add the correpsonding actions. Your extension file should look like this:

![intent_handler_extension](https://github.com/Warkanlock/thinkerless/blob/main/docs/intent_handler_extension.png)

4. On the index.ts file (inside your function folder) create your context using the **CreateContext** function and use it to create an instance of your function extension. Your code should look like this:

![intent_handler_index](https://github.com/Warkanlock/thinkerless/blob/main/docs/intent_handler_index.png)

5. Now, you are in conditions to run your azure function:

`npm start`

Your command line should show the following:

![two_azure_functions_console](https://github.com/Warkanlock/thinkerless/blob/main/docs/two_azure_functions_console.png)

6. In order to test your intent funtion. You have to send a request to your action (in this case: http://localhost:7071/api/azureFunctionExample/category/intent-handler-action) with a body that should look like this:

```json
{
  "intent": {
    "name": "helloWorld",
    "user": {
      "id": "0000-0000-0000-0000-0000",
      "session": "1111-test-test-test",
      "first_name": "First",
      "last_name": "Name",
      "email": "txxnano@example.com",
      "timezone": "America/New_York",
      "locale": "en-US",
      "security": {
        "jwtToken": "<jwt token here>"
      }
    },
    "contexts": {},
    "request": {
      "type": "message",
      "message": "content of the message",
      "parameters": {}
    },
    "responses": []
  },
  "lang": "en"
}
```

Note: On the message field, inside the request field, there could be two types of values: string or object.
Also, you will need to have a local.setting.json file with your secret signature and key like following:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "secret-signature": "your-private-key-signature",
    "secret-key": "5ce4be42c135b69f38c3f04b2f9503846834ae919dc69862834f88e90fccaa3f"
  }
}
```

The return of the action should be over the "responses" key on your request's JSON result.

Have fun!

## How To Deploy It into the Cloud

In order to use this in the cloud the idea is to generate a CI/CD that deploy everything that we use here into azure functions and after that we will be able to consume those endpoints (only thing to do here it's to create and maintain handlers extensions)

## Security Concerns

### Authentication

Authentication is provide by the header

```json
x-api-key : sha256-key
```

In order to generate your secret, you will have to have a value for that in your vault of secrets.

Remember, in your local.settings.json you need to have:

```json

secret-signature : text-which-you-sign-your-token
secret-key : sha256-key

```

**sha256-key** of the local.settings.json need to be the same as **x-api-key** header key which comes with the request.

But you can

### Authorization

Authorization is managed in ourside using:
https://github.com/Warkanlock/thinkerless/tree/main/utils/security
This provides security on the request. Handler object is in charge of verify and create the token needed for the intent handler to validate the user. In other hand, Algorithms is related to encode/decode base64url to base64 without using libraries and to convert an string to byte array. It's like an add-on for the Handler object.

#### Things to consider:

- We are using JWT as standar format token and OAuth as architecture design.
- If you add an Users object inside payload you will need to specify an identifier token.

##### Example:

Specific case without security key:

```json
  ...
    "intent": {
        "name": "helloWorld",
        "user": {
            "id": "UUID of the request",
            "session": "session ID if you want",
            "first_name": "First",
            "last_name": "Name",
            "email": "txxnano@example.com",
            "timezone": "America/New_York",
            "locale": "en-US",
        },
   ...
```

You will get:

```
ERROR: 401: Unauthorized
```

- You have a dictionary with the hash algorithm supported by JWT in the folder **utils/security/models**

### Credits

- Design and code by Ignacio Brasca
