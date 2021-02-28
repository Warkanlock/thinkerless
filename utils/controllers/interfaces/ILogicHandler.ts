import { HttpRequest, Context } from "@azure/functions";

/**
 * To extend in the future, usage with LogicHandler
 *
 * @export
 * @class LogicHandler
 */

export interface ILogicHandler {
  request: HttpRequest;
  context: Context;
}
