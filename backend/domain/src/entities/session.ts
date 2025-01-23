export class Session {
    id!: number;
    utilisateurId!: number;
    tokenHash!: string;
    dateCreation!: Date;
    dateExpiration!: Date;
    statut!: 'actif' | 'révoqué';
  
    constructor(data: Partial<Session>) {
      Object.assign(this, data);
    }
  }
  