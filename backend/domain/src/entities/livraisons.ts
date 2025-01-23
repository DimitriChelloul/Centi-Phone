export class Livraison {
    id!: number;
    commandeId!: number;
    optionLivraisonId?: number;
    adresseLivraison!: string;
    dateLivraisonPrevue?: Date;
    statut?: 'en attente' | 'en cours' | 'livre';
  
    constructor(data: Partial<Livraison>) {
      Object.assign(this, data);
    }
  }
  