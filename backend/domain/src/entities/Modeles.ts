export class Modele {
    id!: number;
    idMarque!: number;
    nomModele!: string;
    anneeSortie?: number;
    systemeExploitation?: string;
    processeur?: string;
    memoireViveGb?: number;
    stockageGb?: number;
    photo?: string;
    couleursDisponibles?: string;
  
    constructor(data: Partial<Modele>) {
      Object.assign(this, data);
    }
  }
  