import base64url from "base64url";
import { createHmac, createHash } from "crypto";
import { TokenTrusted, Token } from "./models/token";
import { hashAlgorithms, TypeAlogithm, algorithms } from "./models/security";
import { CommonModel } from "../validation/models/CommonModel";
import { HttpRequest } from "@azure/functions";
import { ALLOWED_AUTH } from "../controllers/models/network";
import * as appsettings from "../../appsettings.json";

/**
 * Handler need it for manage things related to security like tokens, validation of request and hash
 *
 * @export
 * @class SecurityHandler
 */

//This method needs to extend from KeyVault or Redis or another service to get information from the cloud
export function getKey(): string {
  return (<any>appsettings).secretKey;
}

//This method needs to extend from KeyVault or Redis or another service to get information from the cloud
export function getSignature(): string {
  return (<any>appsettings).secretSignature;
}

export const decodeObject = (content: string): Object => {
  return JSON.parse(base64url.decode(content));
};

export const decode = (token: string, signature: string): TokenTrusted => {
  const tokenObject = createToken(token);

  if (verfiyToken(tokenObject, signature))
    return {
      token: tokenObject,
      verified: true
    };
  else {
    return { token: null, verified: false };
  }
};

export const checkIfUserHasToken = (commonModel: CommonModel) => {
  let isValidToken = true;

  if (ALLOWED_AUTH.USER in commonModel.intent) {
    if (!("security" in commonModel.intent.user)) {
      isValidToken = false;
    }
  } else {
    isValidToken = false;
  }

  return isValidToken;
};

export const checkIfRequestHasHeader = (req: HttpRequest) => {
  let isValidHeader = true;

  if (req.headers[ALLOWED_AUTH.API_KEY]) {
    if (!checkHash(getKey(), req.headers[ALLOWED_AUTH.API_KEY])) {
      isValidHeader = false;
    }
  } else if (!req.headers[ALLOWED_AUTH.API_KEY]) {
    isValidHeader = false;
  }

  return isValidHeader;
};

function checkHash(
  key: string,
  keyToValidate: string,
  messageHashed: boolean = false
): boolean {
  try {
    //You can use this to generate hash and then convert it base64 if you have the header de-hashed
    if (messageHashed) {
      keyToValidate = hash(keyToValidate, {
        type: algorithms.HS256
      });
    }

    //Key processed from the headers
    let keyHashed = Buffer.from(keyToValidate).toString("base64");

    //from KeyVault encoded in SHA256
    let keyToProve = Buffer.from(key).toString("base64");

    //we compare if the string incoming is the same as the hash store in the vault
    return keyToProve == keyHashed;
  } catch (e) {
    throw new Error(e);
  }
}

export function hash(message, algorithm: TypeAlogithm) {
  return createHash(algorithm.type)
    .update(message, "ascii")
    .digest("hex");
}

function verfiyToken(token: Token, signature: string): boolean {
  //Select the algorithm to verify the signature
  let headerDecoder = base64url.decode(token.header);
  let algorithm: string;
  try {
    algorithm = JSON.parse(headerDecoder)["alg"];
  } catch (e) {
    console.error("ERROR: Header is not a valid JSON token");
    console.info("INFO: Set 'sha256' algorithm as default");
    algorithm = "HS256";
  }

  //Create a Hash for the Signature provide
  try {
    var sha = createHmac(hashAlgorithms[algorithm], signature);
  } catch (e) {
    throw new Error(
      `ERROR: Found this errors when we try to create the signature for the token ${e} `
    );
  }
  sha.update(token.header.concat(".", token.payload));

  //Compare the signature
  let decodedCrypto = base64url.toBase64(token.signature);
  let decodedSignature = sha.digest().toString("base64");

  return decodedCrypto === decodedSignature;
}

const createToken = (token: string): Token => {
  let header, payload, signature;

  [header, payload, signature] = token.split(".");

  return {
    header: header,
    payload: payload,
    signature: signature
  };
};
