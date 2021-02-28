import { ContextResponse, Intent, ActionsParams } from "./models/response";
import { HttpRequest, Context } from "@azure/functions";
import { ALLOWED } from "./models/network";
import {
  decode,
  checkIfUserHasToken,
  checkIfRequestHasHeader,
  getSignature,
  decodeObject
} from "../security/securityhandler";
import { ValidateSchema } from "../validation/validator";
import { CommonModel } from "../validation/models/CommonModel";
import { TokenTrusted } from "../security/models/token";
import { useParams, useInformation } from "./hooks";

/**
 * Needed for the creation of the general context which we are going to use in the functionHandler flow
 *
 * @export
 * @class Caller Controller
 */

export const CreateContext = (
  request: HttpRequest,
  context: Context
): ContextResponse => {
  var response: ContextResponse = {
    status: null,
    body: null
  };
  let common_model: CommonModel = request.body;
  const { action, category, all } = useParams(request);
  let intent_response: Intent = useInformation(action, category, all);
  var validToken: boolean = checkIfUserHasToken(common_model);
  var validHeader: boolean = checkIfRequestHasHeader(request);

  context.log.info({ validToken, validHeader });

  //If actionToTake is not null or another identifier in the URL
  if (
    action &&
    (validToken || validHeader) &&
    ValidateSchema(request.body, context)
  ) {
    if (request.method == ALLOWED.POST) {
      //We decode the code incoming by the POST made by CIM
      let tokenVerified: TokenTrusted;

      if (!("user" in common_model.intent)) {
        response = {
          status: 200,
          body: {
            intent: intent_response,
            cimContent: common_model
          }
        };
        context.log.info(
          "INFO: Response success for the intent handler request provide by CIM WITHOUT SECURITY"
        );
      } else {
        if (validHeader && !validToken) {
          response = {
            status: 200,
            body: {
              intent: intent_response,
              cimContent: common_model
            }
          };
          context.log.info(
            "INFO: Response success for the intent handler request provide by CIM"
          );
        } else {
          tokenVerified = decode(
            common_model.intent.user.security.jwtToken,
            getSignature()
          );

          //If the token is trusted using the KeyVault signature
          if (tokenVerified.verified) {
            //Attach claims decode into the security token
            common_model.intent.user.security.claims = decodeObject(
              tokenVerified.token.payload
            );

            response = {
              status: 200,
              body: {
                intent: intent_response,
                cimContent: common_model
              }
            };
            context.log.info(
              "INFO: Response success for the intent handler request provide by CIM"
            );
          } else {
            response = {
              status: 401,
              body: {
                message: "ERROR: User is Not Authorized to fetch this content."
              }
            };
            context.log.error(
              "ERROR: User is Not Authorized to fetch this content."
            );
          }
        }
      }
    } else if (
      request.method == ALLOWED.GET ||
      request.method == ALLOWED.DELETE ||
      request.method == ALLOWED.PUT
    ) {
      response = {
        status: 201,
        body: { message: "ERROR: Method not allowed yet." }
      };
      context.log.error("ERROR: Method not allowed.");
    } else {
      response = {
        status: 404,
        body: {
          message: "ERROR: Resource not found or Method not defined."
        }
      };
      context.log.error("ERROR: Resource not found or Method not defined.");
    }
  } else {
    if (!(validToken || validHeader)) {
      response = {
        status: 403,
        body: {
          message: "ERROR: No information provide for the security aspect."
        }
      };
      context.log.error(
        "ERROR: No information provide for the security aspect."
      );
    } else {
      response = {
        status: 500,
        body: {
          message:
            "ERROR: No information provide for the request needed in the common model."
        }
      };
      context.log.error(
        "ERROR: No information provide for the request needed."
      );
    }
  }

  return response;
};
