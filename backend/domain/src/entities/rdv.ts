export class Rdv {
    id?: number;
    utilisateurId!: number;
    appareilId?: number;
    problemeDescription?: string;
    dateRendezVous!: Date;
    statut?: 'en attente' | 'en cours' | 'termine';
    dateCreation?: Date;
  
    constructor(data: Partial<Rdv>) {
      Object.assign(this, data);
    }
  }
  