import { injectable, inject } from "tsyringe";
import { IAppointmentService } from "../Interfaces/ICalendrierService";
import { ICalendrierRepository } from "../../../dal/src/dal/Interfaces/IcalendrierRepository";
import { IRepairRepository } from "../../../dal/src/dal/Interfaces/IReparationRepository";
import { Horaire } from "@domain/entities/horaire";

@injectable()
export class AppointmentService implements IAppointmentService {
  private dureeMinutes = 20;

  constructor(
    @inject("ICalendrierRepository") private calendrierRepo: ICalendrierRepository,
    @inject("IRepairRepository") private repairRepo: IRepairRepository
  ) {}

  async estJourOuvert(date: Date): Promise<boolean> {
    const jourBDD = (date.getDay() === 0) ? 7 : date.getDay(); // 0 = Dimanche → 7
    const horaire = await this.calendrierRepo.getHorairesByDay(jourBDD);
    return horaire !== null;
  }

  async getAvailableSlots(date: Date): Promise<Date[]> {
    const jourBDD = (date.getDay() === 0) ? 7 : date.getDay();
    const horaires = await this.calendrierRepo.getHorairesByDay(jourBDD);
    if (!horaires) return [];

    const rdvs = await this.repairRepo.getRdvByDate(date);
    const indispos = await this.calendrierRepo.getIndisponibilites(date);

    const ouverture = new Date(date);
    ouverture.setHours(Number(horaires.heureOuverture.split(':')[0]), Number(horaires.heureOuverture.split(':')[1]), 0);

    const fermeture = new Date(date);
    fermeture.setHours(Number(horaires.heureFermeture.split(':')[0]), Number(horaires.heureFermeture.split(':')[1]), 0);

    const creneaux: Date[] = [];
    let currentSlot = new Date(ouverture);

    while ((currentSlot.getTime() + this.dureeMinutes * 60000) <= fermeture.getTime()) {
      const estPris = rdvs.some(rdv => {
        const debutRdv = new Date(rdv.dateRendezVous);
        const finRdv = new Date(debutRdv.getTime() + this.dureeMinutes * 60000);
        return currentSlot < finRdv && new Date(currentSlot.getTime() + this.dureeMinutes * 60000) > debutRdv;
      }) || indispos.some(indispo =>
        currentSlot >= new Date(indispo.dateDebut) && currentSlot < new Date(indispo.dateFin)
      );

      if (!estPris) creneaux.push(new Date(currentSlot));

      currentSlot.setMinutes(currentSlot.getMinutes() + this.dureeMinutes);
    }

    return creneaux;
  }

  async getHorairesByDay(jour: number): Promise<Horaire | null> {
    return this.calendrierRepo.getHorairesByDay(jour);
  }
}
