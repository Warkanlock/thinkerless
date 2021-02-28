export enum algorithms {
  HS256 = "sha256",
  HS384 = "sha384",
  HS512 = "sha512",
  RS256 = "rs256"
}

export const hashAlgorithms = {
  HS256: "sha256",
  HS384: "sha384",
  HS512: "sha512",
  RS256: "rs256"
};

export interface TypeAlogithm {
  type: algorithms;
}
