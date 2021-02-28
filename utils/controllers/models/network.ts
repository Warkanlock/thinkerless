/**
 * network utilities usefull for not hardcoded values
 *
 * @export
 * @class LogicHandler
 */

export const enum ALLOWED {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE"
}

export const enum STATUS {
  REQUEST_ERROR = 400,
  OK = 200,
  SERVER_ERROR = 500
}

export const enum ALLOWED_AUTH {
  USER = "user",
  API_KEY = "x-api-key"
}
