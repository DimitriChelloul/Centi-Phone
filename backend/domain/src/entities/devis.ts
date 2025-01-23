export class Devis {
    id!: number;
    utilisateurId!: number;
    idModele?: number;
    idReparationDisponible?: number;
    descriptionProbleme?: string;
    estimationPrix?: number;
    statut?: 'en attente' | 'accepte' | 'refuse';
    dateCreation?: Date;
  
    constructor(data: Partial<Devis>) {
      Object.assign(this, data);
    }
  }
  