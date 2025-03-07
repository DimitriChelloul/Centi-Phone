

export interface Payload {
  Id: number;         // ID de l'utilisateur
  email: string;          // Adresse e-mail
  role: string; 
  prenom:string;          // Rôle de l'utilisateur ('admin', 'client', etc.)
  nom: string;      // Nom complet de l'utilisateur (optionnel)
  iat?: number;           // Ajouté automatiquement : Date d'émission
  exp?: number;           // Ajouté automatiquement : Date d'expiration
}




