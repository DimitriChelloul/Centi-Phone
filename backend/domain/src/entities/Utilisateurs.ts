export class Utilisateur {
    id?: number; // Ajout de `!` pour indiquer que cette propriété sera initialisée ultérieurement
    nom!: string;
    prenom!: string;
    email!: string;
    mot_de_passe!: string;
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    role!: 'client' | 'admin' | 'employé';
    dateInscription!: Date;
    consentementRgpd!: boolean;
    consentementDate?: Date;
    consentementSource?: string;
    droitAccesDate?: Date;
    droitSuppressionDate?: Date;
    politiqueConfidentialiteVersion?: string;
    secretKey?: string;
  
    constructor(data: Partial<Utilisateur>) {
      Object.assign(this, data);
    }
  }