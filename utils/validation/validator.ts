import { Validator, Schema, ValidationError } from "jsonschema";
import * as schema from "../validation/schema/schema-validation.json";
import { ValidationResultModel } from "./models/ValidationResult.js";
import { Context } from "@azure/functions";

export const ValidateSchema = (
  json_object: JSON,
  context: Context
): boolean => {
  var validate = new Validator();
  let validationResult: ValidationResultModel;

  try {
    validationResult = {
      valid: validate.validate(json_object, schema).valid,
      errors: validate.validate(json_object, schema).errors,
      schema: validate.validate(json_object, schema).schema
    };
  } catch (e) {
    throw new Error(e);
  }

  if (validationResult.errors.length > 0) {
    context.log.error(
      "ERRORS: Errors found in the schema validation \t -> " +
        validationResult.errors.join(",")
    );
  } else if (validationResult.valid === false) {
    context.log.error("ERRORS: \t Schema is not valid");
  } else if (validationResult.schema === undefined) {
    context.log.error("ERRORS: \t Schema is undefined");
  }

  return validationResult.valid && validationResult.errors.length == 0
    ? true
    : false;
};
