declare namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_ACCESS_TOKEN: string;
      PUBLIC_ACCESS_TOKEN: string;
      PRODUCTION: string;
      MONGO_URI: string;
      SECRET: string;
      PORT: number;
    }
  }