import { Horaire } from "@domain/entities/horaire";

export interface IAppointmentService {
  /**
   * Vérifie si le magasin est ouvert à une date donnée.
   * @param date Date à vérifier
   * @returns `true` si le magasin est ouvert, sinon `false`
   */
  estJourOuvert(date: Date): Promise<boolean>;

  /**
   * Récupère les créneaux horaires disponibles pour une date donnée.
   * @param date Date pour laquelle on veut les créneaux
   * @returns Liste des créneaux horaires disponibles sous forme de tableau de `Date`
   */
  getAvailableSlots(date: Date): Promise<Date[]>;

  /**
   * Récupère les horaires d'ouverture du magasin pour un jour précis.
   * @param jour Numéro du jour (1 = Lundi, 7 = Dimanche)
   * @returns Horaire du magasin ou `null` si fermé
   */
  getHorairesByDay(jour: number): Promise<Horaire | null>;
}
