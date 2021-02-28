import { Schema, ValidationError } from "jsonschema";

export interface ValidationResultModel {
  valid: boolean;
  errors: ValidationError[] | [];
  schema: Schema;
}
