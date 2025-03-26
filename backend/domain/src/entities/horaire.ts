export class Horaire {
    id!: number;
    jour!: number; // 0 à 6
    heureOuverture!: string; // '08:00'
    heureFermeture!: string; // '18:00'
  
    constructor(data: Partial<Horaire>) {
      Object.assign(this, data);
    }
  }
  