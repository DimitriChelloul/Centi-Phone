export class RepairOption {
    id!: number;
    idModele!: number;
    typeReparation!: string;
    description?: string;
    prixReparation!: number;
    dureeEstimee?: string;
  
    constructor(data: Partial<RepairOption>) {
      Object.assign(this, data);
    }
  }
  