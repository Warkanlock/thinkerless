import { HttpRequest, Context } from "@azure/functions";
import { LogicHandler } from "../controllers/logichandler";
import { ResponseModel } from "../validation/models/CommonModel";

/**
 * Extended Controller class which replace with a function.
 *
 * @export
 * @class LogicHandler
 */

export class ExampleHandler extends LogicHandler {
  constructor(_request: HttpRequest, _context: Context) {
    super(_request, _context);
  }

  //Intent Handler async action that trigger with action name provides by the request
  async helloWorld(): Promise<ResponseModel> {
    this.context.log.warn(
      "WARN: \t  This is a test function trigger by an intent-handler"
    );

    var responseModel: ResponseModel = {
      type: "text",
      text: "This is an example from an async call!!!"
    };

    return new Promise((resolve, reject) => {
      try {
        setTimeout(function() {
          // Emulate Async behaviour, if you want to hit an API you will have to make a promise for this
          resolve(responseModel);
        }, 2000);
      } catch {
        reject("ERROR: This is an error test");
      }
    });
  }

  //Logic to call an Endpoint/API and fetch the correct information for that intent-name
  "weather-today"(): ResponseModel {
    this.context.log.warn(
      "WARN: \t This is a test non-async-function trigger by an intent-handler"
    );

    var responseModel: ResponseModel = {
      type: "text",
      text: "This content has to return from an API"
    };

    return responseModel;
  }
}
