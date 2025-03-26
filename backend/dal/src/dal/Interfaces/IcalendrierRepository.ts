import { Horaire } from '@domain/entities/horaire';
import { Indisponibilite } from '@domain/entities/indisponibilite';

export interface ICalendrierRepository {
  getHorairesByDay(day: number): Promise<Horaire | null>;
  getIndisponibilites(date: Date): Promise<Indisponibilite[]>;
}
