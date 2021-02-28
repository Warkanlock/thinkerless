export interface CommonModel {
  intent?: IntentModel;
  timestamp?: string;
  lang?: string;
}

export interface IntentModel {
  name?: string;
  user?: UserModel;
  contexts?: ContextModel;
  request?: RequestModel;
  responses?: ResponseModel[];
}

export interface ContextModel {
  intent?: string;
  message?: string;
  parameters?: Object;
}

export interface UserModel {
  id?: string | number;
  session?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  currency?: string;
  timezone?: string;
  security?: SecurityModel;
}

export interface SecurityModel {
  jwtToken: string;
  claims?: Object;
}

export interface RequestModel {
  type?: string;
  message: string;
  parameters?: Object;
}

export interface ResponseModel {
  type?: string;
  text?: string;
  image?: string;
  random?: Object;
}
