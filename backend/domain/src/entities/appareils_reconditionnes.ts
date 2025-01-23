export class ProduitsReconditionnes {
    id!: number;
    nom!: string;
    description?: string;
    photoProduit?: string;
    prix!: number;
    stock?: number;
    garantieMois?: number;
    dateReconditionnement?: Date;
    dateAjout?: Date;
    idMarque!: number;
    idModele!: number;
  
    constructor(data: Partial<ProduitsReconditionnes>) {
      Object.assign(this, data);
    }
  }
  