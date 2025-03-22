 
namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    PORT?: string
    MONGO_URI: string
    JWT_SECRET: string
    DATABASE_URL: string
    AUTH_SECRET: string
    NODE_OPTIONS: string
  }
}
