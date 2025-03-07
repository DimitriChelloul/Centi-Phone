// src/types/JwtPayload.ts
// types.ts
export interface JwtPayload {
  userId: number;  // ⚠️ Changé de 'id' à 'userId' pour correspondre au token généré
  email: string;
  role: "client" | "admin" | "employé";
  fullName: string;
  iat?: number;
  exp?: number;
}
  