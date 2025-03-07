import cors from "cors";

export const corsOptions = {
  origin: ["https://localhost:4200"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, 
  allowedHeaders: [
    "Content-Type", 
    "Authorization",
    "X-CSRF-Token",
    "x-csrf-token"
    
  ]
  
};

export const corsMiddleware = cors(corsOptions);
