export class Commande {
    id?: number;
    utilisateurId!: number;
    dateCommande!: Date;
    total!: number;
    statutPaiement!: 'en attente' | 'payé' | 'échoué' | 'remboursé';
  
    constructor(data: Partial<Commande>) {
      Object.assign(this, data);
    }
  }
  