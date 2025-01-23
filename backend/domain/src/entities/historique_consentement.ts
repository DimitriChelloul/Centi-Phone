export class HistoriqueConsentement {
    id!: number;
    utilisateurId!: number;
    typeConsentement!: string;
    statut!: boolean;
    dateModification?: Date;
    source?: string;
    adresseIp?: string;
  
    constructor(data: Partial<HistoriqueConsentement>) {
      Object.assign(this, data);
    }
  }

  
  