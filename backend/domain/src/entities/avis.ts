export class Avis {
    id?: number;
    utilisateurId!: number;
    produitAVendreId?: number;
    appareilReconditionneId?: number;
    commentaire?: string;
    note?: number;
    dateCreation?: Date;
  
    constructor(data: Partial<Avis>) {
      Object.assign(this, data);
    }
  }
  