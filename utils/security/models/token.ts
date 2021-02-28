export interface Token {
  header: string;
  payload: string;
  signature: string;
}

export interface TokenTrusted {
  token: Token;
  verified: boolean;
}
