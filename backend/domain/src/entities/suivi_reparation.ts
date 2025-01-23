export class SuiviReparation {
    id?: number;
    rendezVousId!: number;
    statut?: 'en cours' | 'termine';
    dateStatut?: Date;
  
    constructor(data: Partial<SuiviReparation>) {
      Object.assign(this, data);
    }
  }
  