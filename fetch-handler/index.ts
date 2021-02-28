import { AzureFunction, Context, HttpRequest } from "@azure/functions";

//Function Extension
import { CreateContext } from "../utils/controllers/callers";
import { FunctionHandler } from "../utils/controllers/functionhandler";

//Models Extension
import { ContextResponse } from "../utils/controllers/models/response";
import { STATUS } from "../utils/controllers/models/network";

//Logic Extension
import { ExampleFetchHandler } from "../utils/extensions/exampleFetchHandler";

//NOTE: Signature provide by KeyVault Credentials

const ih_template: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  //This will create a Context with the request data and make an object from that
  let contextIntent: ContextResponse = CreateContext(req, context);

  //Core logic for the external API call to fetch data and reply questions made by users
  var logicController = new ExampleFetchHandler(req, context);

  if (contextIntent.status == STATUS.OK) {
    //Use that logicController and merge with the Context in other to call functions and make the final object
    context.res = await FunctionHandler(
      contextIntent,
      logicController,
      context
    );
  } else if (
    contextIntent.status >= STATUS.REQUEST_ERROR ||
    contextIntent.status <= STATUS.SERVER_ERROR
  ) {
    context.res = contextIntent;
  }
};

export default ih_template;
