import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IAppointmentService } from '../../../bll/src/Interfaces/ICalendrierService';

/**
 * Vérifie si le magasin est ouvert à la date donnée.
 */
export const estJourOuvert = async (req: Request, res: Response) => {
  try {
    const date = new Date(req.query.date as string);
    const appointmentService = container.resolve<IAppointmentService>('IAppointmentService');
    const ouvert = await appointmentService.estJourOuvert(date);

    res.json({ ouvert });
  } catch (error) {
    console.error('Erreur serveur dans estJourOuvert:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Récupère les créneaux horaires disponibles pour une date donnée.
 */
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const date = new Date(req.query.date as string);
    const appointmentService = container.resolve<IAppointmentService>('IAppointmentService');
    const slots = await appointmentService.getAvailableSlots(date);

    res.json({ slots: slots.map(slot => slot.toISOString()) });
  } catch (error) {
    console.error('Erreur serveur dans getAvailableSlots:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
