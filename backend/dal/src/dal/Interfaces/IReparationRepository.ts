import { Rdv } from '../../../../domain/src/entities/rdv';
import { SuiviReparation } from '../../../../domain/src/entities/suivi_reparation';
import { Devis } from '../../../../domain/src/entities/devis';
import { PoolClient } from 'pg';

export interface IRepairRepository {
  initialize(client: PoolClient): unknown;
  // Gestion des rendez-vous
  createRdv(appointment: Rdv): Promise<Rdv>;
  getRdvByUserId(userId: number): Promise<Rdv[]>;
  getRdvById(id: number): Promise<Rdv | null>;
  deleteRdv(id: number): Promise<void>;
  getAllRdvs(): Promise<{ rdv: Rdv, utilisateur: any }[]>;
  getRdvDetailsById(id: number): Promise<{ rdv: Rdv, utilisateur: any } | null>;
  updateRdvStatus(id: number, statut: 'en attente' | 'en cours' | 'termine'): Promise<void>;
  getRdvByDate(date: Date): Promise<Rdv[]>;
  isSlotAvailable(date: Date, dureeMinutes: number): Promise<boolean>

  // Gestion des suivis de réparation
  getRSuiviReparationByAppointmentId(appointmentId: number): Promise<SuiviReparation[]>;
  addSuiviReparation(tracking: SuiviReparation): Promise<void>;

  // Gestion des devis
  createDevis(devis: Devis): Promise<Devis>;
  getDevisByUserId(userId: number): Promise<Devis[]>;
  getDevisById(id: number): Promise<Devis | null>;
  updateDevis(devis: Devis): Promise<Devis>;
}
