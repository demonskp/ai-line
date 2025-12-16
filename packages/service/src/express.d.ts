import "express";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      requestId?: string;
      user?: User;
      t: (key: string, options?: TOptions) => string;
      [key: string]: any;
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      JWT_SECRET: string;
      CRYPTO_SECRET_KEY: string;
    }
  }
}
