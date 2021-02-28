import { ContextResponse } from "./models/response";
import { LogicHandler } from "./logichandler";
import { Context } from "@azure/functions";
import { ResponseModel } from "../validation/models/CommonModel";

/**
 * In charge of call and manage function flow specify in the extensions/handlers
 *
 * @export
 * @class SecurityHandler
 */

export const FunctionHandler = async (
  responseBeforeAPI: ContextResponse,
  logic: LogicHandler,
  context: Context
): Promise<ContextResponse> => {
  var action: string;
  var messageResponse: ResponseModel[] = [];
  var responseWithInformation: ContextResponse = {
    status: null,
    body: {
      message: ""
    }
  };

  try {
    if ("cimContent" in responseBeforeAPI.body) {
      if (
        responseBeforeAPI.body.cimContent.intent.name in
        responseBeforeAPI.body.cimContent.intent
      ) {
        action = responseBeforeAPI.body.cimContent.intent.name;
      } else {
        action = responseBeforeAPI.body.intent.information.action_name;
      }
      context.log.info(`INFO: Action Name ${action}`);
    } else {
      responseWithInformation = {
        status: 404,
        body: {
          message: "ERROR: Server not found that intent-name function"
        }
      };
    }

    responseWithInformation = await callback(
      logic,
      action,
      context,
      messageResponse,
      responseBeforeAPI,
      responseWithInformation
    );

    return responseWithInformation;
  } catch (e) {
    throw new Error(e);
  }
};

const callback = async (
  logic: LogicHandler,
  action: string,
  context: Context,
  messageResponse: ResponseModel[],
  request: ContextResponse,
  response: ContextResponse
): Promise<ContextResponse> => {
  if (logic[action] && typeof logic[action] === "function") {
    //Use the function provides by the LogicHandler
    try {
      context.log.info(`INFO: Trigger Function called -> ${action}`);

      let responseModelResponse: ResponseModel = await logic[action](request);
      messageResponse.push(responseModelResponse);

      context.log.info(`INFO: Logic Intent Handler Finished -> ${action}`);

      request.body.cimContent.intent.name = action;
      request.body.cimContent.intent.responses = messageResponse;

      //Fetch API and fullfil all the data get by that request and put into responseWithInformation
      return (response = {
        status: request.status,
        body: {
          ...request.body
        }
      });
    } catch (e) {
      console.error(e);
      return (response = {
        status: 500,
        body: {
          message: "ERROR: Intent Handler not found for that Controller"
        }
      });
    }
  }
};
