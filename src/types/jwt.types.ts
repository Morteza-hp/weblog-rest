export type JwtPayload = {
  user: {
    userId: string;
    email?: string;
    fullname?: string;
  };
  iat?: number;
  exp?: number;
};
