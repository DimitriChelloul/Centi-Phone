export class CommandDetail {
    id!: number;
    commandeId!: number;
    produitAVendreId?: number;
    appareilReconditionneId?: number;
    quantite!: number;
    prixUnitaire!: number;
  
    constructor(data: Partial<CommandDetail>) {
      Object.assign(this, data);
    }
  }
  