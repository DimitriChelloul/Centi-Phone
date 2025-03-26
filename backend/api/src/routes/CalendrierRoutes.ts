import { Router } from 'express';
import { getAvailableSlots, estJourOuvert } from '../controllers/CalendrierController';

const router = Router();

// Route pour vérifier si le magasin est ouvert à une date donnée
router.get('/is-open', estJourOuvert);

// Route pour obtenir les créneaux disponibles à une date donnée
router.get('/available-slots', getAvailableSlots);

export default router;
