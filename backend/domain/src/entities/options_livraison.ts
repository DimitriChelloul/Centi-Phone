export class OptionsDeLivraison {
    id!: number;
    nom!: string;
    description?: string;
    prix!: number;
  
    constructor(data: Partial<OptionsDeLivraison>) {
      Object.assign(this, data);
    }
  }
  