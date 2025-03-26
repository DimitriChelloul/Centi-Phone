import { injectable, inject } from 'tsyringe';
import { Pool } from 'pg';
import { Horaire } from '@domain/entities/horaire';
import { Indisponibilite } from '@domain/entities/indisponibilite';
import { ICalendrierRepository } from '../Interfaces/IcalendrierRepository';

@injectable()
export class CalendrierRepository implements ICalendrierRepository {
  constructor(@inject("Pool") private pool: Pool) {}

  async getHorairesByDay(day: number): Promise<Horaire | null> {
    const res = await this.pool.query(
      'SELECT * FROM horaires_magasin WHERE jour = $1',
      [day]
    );
    return res.rowCount ? new Horaire(res.rows[0]) : null;
  }

  async getIndisponibilites(date: Date): Promise<Indisponibilite[]> {
    const res = await this.pool.query(
      'SELECT * FROM indisponibilites WHERE date_debut::date <= $1 AND date_fin::date >= $1',
      [date.toISOString().split('T')[0]]
    );
    return res.rows.map(row => new Indisponibilite(row));
  }
}
