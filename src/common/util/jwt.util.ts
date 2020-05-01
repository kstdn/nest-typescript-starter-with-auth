type SplitJwtToken = { headerAndPayload: string; signature };

export const splitJwtToken = (jwtToken: string): SplitJwtToken => {
  const [header, payload, signature] = jwtToken.split('.');
  return {
    headerAndPayload: `${header}.${payload}`,
    signature: signature,
  };
};

export const joinJwtToken = (...parts: string[]): string => {
  return parts.join('.');
};
