import { Rdv } from '../../../domain/src/entities/rdv';
import { SuiviReparation } from '../../../domain/src/entities/suivi_reparation';
import { Devis } from '../../../domain/src/entities/devis';

export interface IRepairService {
  // Gestion des rendez-vous
  createRdv(utilisateurId: number | undefined, email: string, dateRdv: Date): Promise<void>;
  getRdvsByUserId(utilisateurId: number): Promise<Rdv[]>;
  getRdvById(rdvId: number): Promise<Rdv | null>;
  cancelRdv(rdvId: number): Promise<void>;
   updateRdvStatus(id: number, statut: 'en attente' | 'en cours' | 'termine'): Promise<void>;
   getRdvDetails(id: number):Promise<{ rdv: Rdv, utilisateur: any } | null>;
   getAllRdvs():Promise<{ rdv: Rdv, utilisateur: any }[]>;
   

  // Gestion des suivis de réparation
  addSuiviReparation(rdvId: number, statut: 'en cours' | 'termine'): Promise<void>;
  getSuiviReparationByRdvId(rdvId: number): Promise<SuiviReparation[]>;
  updateStatutReparation(rendezVousId: number,statut: string,clientEmail: string,clientName: string): Promise<void>

  // Gestion des devis
  createDevis(utilisateurId: number, devis: Devis): Promise<Devis>;
  getDevisByUserId(utilisateurId: number): Promise<Devis[]>;
  getDevisById(devisId: number): Promise<Devis | null>;
  updateDevisStatus(devisId: number, statut: 'en attente' | 'accepte' | 'refuse'): Promise<Devis>;
}
