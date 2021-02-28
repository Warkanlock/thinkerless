import base64url from "base64url";

/**
 * Security Utils
 *
 * @export
 * @class SecurityHandler
 */

//Convert a String to ByteArray
export const GetBytes = (stringTo: string): string => {
  let bytes = [];

  for (let index = 0; index < stringTo.length; index++) {
    bytes.push(stringTo.charCodeAt(index));
  }

  return bytes.toString();
};

//Base64 to Base64Url (from string)
export const Base64UrlEncode = (input: string): string => {
  var output = base64url.toBase64(input);
  output = output.split("=")[0];
  output = output.replace("+", "-").replace("/", "_");
  return output;
};

//Base64 to Base64 (from string)
export const Base64UrlDecode = (input: string): string => {
  var output = input;

  output = output.replace("-", "+").replace("_", "/");

  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("ERROR: Illegal base64url string");
  }

  return base64url.fromBase64(output);
};
