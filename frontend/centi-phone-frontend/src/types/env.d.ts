declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production';
      SSL_CERT_PATH?: string;
      SSL_KEY_PATH?: string;
    }
  }
  