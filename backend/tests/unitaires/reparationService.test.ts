import { RepairService } from '../../bll/src/services/ReparationService';
import { IRepairRepository } from '../../dal/src/dal/Interfaces/IReparationRepository';
import { Rdv } from '../../domain/src/entities/rdv';
import { IUnitOfWork } from '../../dal/src/dal/Interfaces/IUnitOfWork';
import { IEmailService } from '../../bll/src/Interfaces/IEmailService';

//describe est une fonction de Jest qui regroupe les tests. RepairService est le nom du groupe de tests.
describe('RepairService', () => {
  //Les variables repairService, mockRepairRepository, mockUnitOfWork, et mockEmailService sont déclarées pour être utilisées dans les tests.
  let repairService: RepairService;
  let mockRepairRepository: jest.Mocked<IRepairRepository>;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
  let mockEmailService: jest.Mocked<IEmailService>;

  //beforeEach est une fonction de Jest qui s'exécute avant chaque test. Elle initialise les mocks pour les dépendances du service.
  beforeEach(() => {
    // mockRepairRepository est un objet mock avec des méthodes simulées (jest.fn()) pour chaque méthode de l'interface IRepairRepository.
    mockRepairRepository = {
        initialize: jest.fn(),
      createRdv: jest.fn(),
      getRdvByUserId: jest.fn(),
      getRdvById: jest.fn(),
      deleteRdv: jest.fn(),
      addSuiviReparation: jest.fn(),
      getRSuiviReparationByAppointmentId: jest.fn(),
      createDevis: jest.fn(),
      getDevisByUserId: jest.fn(),
      getDevisById: jest.fn(),
      updateDevis: jest.fn(),
    };

    //mockUnitOfWork est un objet mock pour l'unité de travail avec des méthodes simulées et une référence à mockRepairRepository.
    mockUnitOfWork = {
      start: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      repairRepository: mockRepairRepository,
    } as unknown as jest.Mocked<IUnitOfWork>;

    //mockEmailService est un objet mock pour le service d'email avec une méthode simulée sendEmail.
    mockEmailService = {
      sendEmail: jest.fn(),
    };

    //Une nouvelle instance de RepairService est créée avec les mocks comme dépendances.
    repairService = new RepairService(
      mockRepairRepository,
      mockUnitOfWork,
      mockEmailService
    );
  });

  //afterEach est une fonction de Jest qui s'exécute après chaque test.
  //  Elle réinitialise tous les mocks pour s'assurer qu'ils sont dans un état propre pour le prochain test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  //it est une fonction de Jest qui définit un test individuel. Ce test vérifie que le service peut créer un rendez-vous et envoyer un email de confirmation.
  it('devrait créer un rendez-vous et envoyer un email de confirmation', async () => {
    //Les variables utilisateurId, email, dateRdv, et mockRdv sont initialisées pour le test.
    const utilisateurId = 1;
    const email = 'test@example.com';
    const dateRdv = new Date();
    const mockRdv: Rdv = {
      id: 1,
      utilisateurId,
      dateRendezVous: dateRdv,
      statut: 'en attente',
    };

    //La méthode createRdv du mock mockRepairRepository est configurée pour retourner une promesse résolue avec mockRdv.
    mockRepairRepository.createRdv.mockResolvedValue(mockRdv);

    //La méthode createRdv du service est appelée avec les paramètres de test.
    await repairService.createRdv(utilisateurId, email, dateRdv);

    // Vérifier que le rendez-vous a été créé
    //Les assertions vérifient que createRdv a été appelé avec les bons arguments et que initialize a été appelé.
    expect(mockRepairRepository.createRdv).toHaveBeenCalledWith({
      utilisateurId,
      dateRendezVous: dateRdv,
      statut: 'en attente',
    });

    //
    expect(mockRepairRepository.initialize).toHaveBeenCalled();

    // Les assertions vérifient que sendEmail a été appelé avec les bons arguments, y compris un message contenant la date du rendez-vous.
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      email,
      'Confirmation de rendez-vous',
      expect.stringContaining(`Votre rendez-vous est prévu pour le ${dateRdv.toLocaleString()}.`)
    );

    // L'assertion vérifie que commit a été appelé pour valider la transaction.
    expect(mockUnitOfWork.commit).toHaveBeenCalled();
  });

  //vérifie que le service peut récupérer les rendez-vous pour un utilisateur donné.
  it('devrait récupérer les rendez-vous pour un utilisateur donné', async () => {
    //Les variables utilisateurId et mockRdvs sont initialisées pour le test.
    const utilisateurId = 1;
    const mockRdvs: Rdv[] = [
      { id: 1, utilisateurId, dateRendezVous: new Date(), statut: 'en attente' },
      { id: 2, utilisateurId, dateRendezVous: new Date(), statut: 'en cours' },
    ];

    //La méthode getRdvByUserId du mock mockRepairRepository est configurée pour retourner une promesse résolue avec mockRdvs.
    mockRepairRepository.getRdvByUserId.mockResolvedValue(mockRdvs);

    //La méthode getRdvsByUserId du service est appelée avec utilisateurId.
    const rdvs = await repairService.getRdvsByUserId(utilisateurId);

    //Les assertions vérifient que initialize a été appelé, que les rendez-vous retournés sont égaux à mockRdvs, et que getRdvByUserId a été appelé avec utilisateurId.
    expect(mockRepairRepository.initialize).toHaveBeenCalled();

    expect(rdvs).toEqual(mockRdvs);
    expect(mockRepairRepository.getRdvByUserId).toHaveBeenCalledWith(utilisateurId);
  });

  //Ce test vérifie que le service peut récupérer un rendez-vous par son ID.
  it('devrait récupérer un rendez-vous par son ID', async () => {
    //Les variables rdvId et mockRdv sont initialisées pour le test.
    const rdvId = 1;
    const mockRdv: Rdv = {
      id: rdvId,
      utilisateurId: 1,
      dateRendezVous: new Date(),
      statut: 'en attente',
    };

    //La méthode getRdvById du mock mockRepairRepository est configurée pour retourner une promesse résolue avec mockRdv.
    mockRepairRepository.getRdvById.mockResolvedValue(mockRdv);

    //La méthode getRdvById du service est appelée avec rdvId.
    const rdv = await repairService.getRdvById(rdvId);

    //Les assertions vérifient que initialize a été appelé, que le rendez-vous retourné est égal à mockRdv, et que getRdvById a été appelé avec rdvId.
    expect(mockRepairRepository.initialize).toHaveBeenCalled();

    expect(rdv).toEqual(mockRdv);
    expect(mockRepairRepository.getRdvById).toHaveBeenCalledWith(rdvId);
  });

  //Ce test vérifie que le service peut supprimer un rendez-vous par son ID.
  it('devrait supprimer un rendez-vous par son ID', async () => {
    //La variable rdvId est initialisée pour le test.
    const rdvId = 1;

    //La méthode deleteRdv du mock mockRepairRepository est configurée pour retourner une promesse résolue.
    mockRepairRepository.deleteRdv.mockResolvedValue();

    //La méthode cancelRdv du service est appelée avec rdvId.
    await repairService.cancelRdv(rdvId);

    //Les assertions vérifient que initialize a été appelé et que deleteRdv a été appelé avec rdvId.
    expect(mockRepairRepository.initialize).toHaveBeenCalled();

    expect(mockRepairRepository.deleteRdv).toHaveBeenCalledWith(rdvId);
  });

  //Ce test vérifie que le service lance une erreur si la création du rendez-vous échoue.
  it('devrait lancer une erreur si la création du rendez-vous échoue', async () => {
    //Les variables utilisateurId, email, et dateRdv sont initialisées pour le test.
    const utilisateurId = 1;
    const email = 'test@example.com';
    const dateRdv = new Date();

    //La méthode createRdv du mock mockRepairRepository est configurée pour retourner une promesse rejetée avec une erreur.
    mockRepairRepository.createRdv.mockRejectedValue(
      new Error('Erreur lors de la création du rendez-vous')
    );

    //L'assertion vérifie que initialize a été appelé.
    expect(mockRepairRepository.initialize).toHaveBeenCalled();

    //L'assertion vérifie que la méthode createRdv du service lance une erreur avec le message spécifié.
    await expect(repairService.createRdv(utilisateurId, email, dateRdv)).rejects.toThrow(
      'Erreur lors de la création du rendez-vous'
    );

    // Vérifier que le rollback est appelé
    expect(mockUnitOfWork.rollback).toHaveBeenCalled();
  });
});
