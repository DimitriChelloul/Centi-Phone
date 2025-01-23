// src/types/JwtPayload.ts
export interface JwtPayload {
    id: number;
    nom: string;
    prenom: string;
    motDePasse:string;
    dateInscription:Date;
    consentementRgpd: Boolean;
    email: string;
    role: "client" | "admin" | "employé";
  }
  