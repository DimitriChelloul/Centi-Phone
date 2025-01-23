export class ProduitsAVendre {
    id!: number;
    nom!: string;
    description?: string;
    photoProduit?: string;
    prix!: number;
    stock?: number;
    dateAjout?: Date;
  
    constructor(data: Partial<ProduitsAVendre>) {
      Object.assign(this, data);
    }
  }
  