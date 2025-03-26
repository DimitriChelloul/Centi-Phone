export class Indisponibilite {
    id!: number;
    dateDebut!: Date;
    dateFin!: Date;
    motif?: string;
  
    constructor(data: Partial<Indisponibilite>) {
      Object.assign(this, data);
    }
  }
  