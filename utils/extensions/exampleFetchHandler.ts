import { HttpRequest, Context } from "@azure/functions";
import { LogicHandler } from "../controllers/logichandler";
import { ResponseModel, CommonModel } from "../validation/models/CommonModel";
import { ContextResponse } from "../controllers/models/response";

/**
 * Extended Controller class which replace with a function.
 *
 * @export
 * @class LogicHandler
 */

export class ExampleFetchHandler extends LogicHandler {
  constructor(_request: HttpRequest, _context: Context) {
    super(_request, _context);
  }

  //Intent Handler async action that trigger with action name provides by the request
  async postExample(context: ContextResponse): Promise<ResponseModel> {
    this.context.log.warn("WARN: \t  ServiceNow Handler triggered");

    var responseModel: ResponseModel = {
      type: "random",
      random: []
    };
    
    return new Promise((resolve, reject) => {
      try {
        var options = {
          method: "POST",
          url:
            "https://example.com",
          headers: {
            Accept: "application/json"
          },
          body: JSON.stringify({
            hello : "there"
          })
        };

        this.fetch(options)
          .then(resp => {
            let responseList: ResponseModel[] = [];

            responseList.push({
              type: "text",
              text: JSON.stringify(resp)
            });

            responseModel.random = responseList;

            resolve(responseModel);
          })
          .catch(e => {
            console.error(e);
          });
      } catch (e) {
        console.error(e);
        reject(
          "ERROR: Something happen with the connection. Check your URL and your request body"
        );
      }
    });
  }

  //Intent Handler async action that trigger with action name provides by the request
  async getExample(context: ContextResponse): Promise<ResponseModel> {
    this.context.log.warn("WARN: \t  ServiceNow Handler triggered");

    var responseModel: ResponseModel = {
      type: "random",
      random: []
    };
    
    return new Promise((resolve, reject) => {
      try {
        var options = {
          method: "GET",
          url:
            "https://example.com",
          headers: {
            "Content-Type": ["application/json", "application/json"],
            Accept: "application/json",
          },
        };

        this.fetch(options)
          .then(resp => {
            let responseList: ResponseModel[] = [];

            responseList.push({
              type: "text",
              text: JSON.stringify(resp)
            });

            responseModel.random = responseList;

            resolve(responseModel);
          })
          .catch(e => {
            console.error(e);
          });
      } catch (e) {
        console.error(e);
        reject(
          "ERROR: Something happen with the connection. Check your URL and your request body"
        );
      }
    });
  }
}
