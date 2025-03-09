declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string
        GEMINI_API_KEY: string
      }
    }
  }
  
  export {}
  
  