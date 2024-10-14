declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      DATABASE_URL: string;

      TW_ACCOUNT_SID: string;
      TW_AUTH_TOKEN: string;
      TW_NUMBER: string;
      PHONE_NUMBER: string;

      RABBITMQ_URL_DEV: string;
      RABBITMQ_URL_PROD: string;

      PEM_PATH: string;
      SSH_USER: string;
      SSH_HOST: string;
    }
  }
}

export {};
