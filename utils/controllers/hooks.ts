import { HttpRequest } from "../../node_modules/@azure/functions/Interfaces";
import { ActionsParams, Intent } from "./models/response";

/**
 * Hooks to determinate if we are going to use params or information from the route request
 *
 * @export
 * @class SecurityHandler
 */

export const useParams = (request: HttpRequest): ActionsParams => {
  let params: ActionsParams;

  try {
    if ("params" in request) {
      params = {
        action: request.params.intent_action,
        category: request.params.intent_category,
        all: request.params
      };
    } else {
      params = null;
    }
  } catch (e) {
    throw new Error(e);
  }

  return params;
};

export const useInformation = (
  action: string,
  category: string,
  all: any
): Intent => {
  //TODO: Call the respectible action for that specific chatbot and get a JSON response from that
  let data = JSON.stringify({
    action_name: action
  });

  return {
    information: JSON.parse(data),
    category: category,
    other: all
  };
};
