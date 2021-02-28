import { CommonModel } from "../../validation/models/CommonModel";

/**
 * Common Model Structure
 *
 * @export
 * @class LogicHandler
 */

export interface ContextResponse {
  status: number;
  body: ContextStructure;
}

export interface ContextStructure {
  intent?: Intent;
  cimContent?: CommonModel;
  message?: string;
  responseContent?: Object;
}

export interface Intent {
  information: InformationParameters;
  category: string;
  other: any;
}

export interface InformationParameters {
  action_name: string;
}

export interface ActionsParams {
  action: string;
  category: string;
  all?: Object;
}
