export class Marques {
    id!: number;
    nomMarque!: string;
  
    constructor(data: Partial<Marques>) {
      Object.assign(this, data);
    }
  }
  