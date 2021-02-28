import { HttpRequest, Context } from "@azure/functions";
import { ILogicHandler } from "./interfaces/ILogicHandler";
var request = require("request");

/**
 * Controller class which replace with a function.
 *
 * @export
 * @class LogicHandler
 */

export class LogicHandler implements ILogicHandler {
  public request: HttpRequest;
  public context: Context;

  constructor(_request: HttpRequest, _context: Context) {
    this.request = _request;
    this.context = _context;
  }

  async fetch(options) {
    try {
      return new Promise((resolve, rejected) => {
        request(options, (error, response) => {
          if (error) {
            rejected(error);
          } else {
            resolve(response.body);
          }
        });
      });
    } catch (e) {
      throw new Error("ERROR: Seems to be a problem with the network -> " + e);
    }
  }
}
