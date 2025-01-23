import "reflect-metadata"; // Nécessaire pour tsyringe
import { container } from "tsyringe";

// Interfaces des repositories
import { IUtilisateurRepository } from "../../dal/src/dal/Interfaces/IUtilisateurRepository.js";
import { IRepairRepository } from "../../dal/src/dal/Interfaces/IReparationRepository.js";
import { IProductRepository } from "../../dal/src/dal/Interfaces/IProduitRepository";
import { ICommandRepository } from "../../dal/src/dal/Interfaces/ICommandeRepository";
import { IReviewRepository } from "../../dal/src/dal/Interfaces/IAvisRepository";
import { IUnitOfWork } from "../../dal/src/dal/Interfaces/IUnitOfWork";

// Implémentations des repositories
import { UtilisateurRepository } from "../../dal/src/dal/repositories/UtilisateurRepository";
import { RepairRepository } from "../../dal/src/dal/repositories/ReparationRepository.js";
import { ProductRepository } from "../../dal/src/dal/repositories/ProduitRepository";
import { CommandRepository } from "../../dal/src/dal/repositories/CommandeRepository";
import { ReviewRepository } from "../../dal/src/dal/repositories/AvisRepository";
import { UnitOfWork } from "../../dal/src/dal/UnitOfWork/UnitOfWork";

// Interfaces des services
import { IUtilisateurService } from "../../bll/src/Interfaces/IUtilisateurService";
import { IRepairService } from "../../bll/src/Interfaces/IReparationService";
import { IProductService } from "../../bll/src/Interfaces/IProduitService";
import { ICommandService } from "../../bll/src/Interfaces/ICommandeService";
import { IReviewService } from "../../bll/src/Interfaces/IAvisService";

// Implémentations des services
import { UtilisateurService } from "../../bll/src/services/UtilisateurService";
import { RepairService } from "../../bll/src/services/ReparationService";
import { ProductService } from "../../bll/src/services/ProduitService";
import { CommandeService } from "../../bll/src/services/CommandService";
import { ReviewService } from "../../bll/src/services/AvisService";

// payment services
import { IPaymentService } from "../../bll/src/Interfaces/IPaymentService";
import { PaymentService } from "../../bll/src/services/paymentService";

// Email
import { IEmailService } from "../../bll/src/Interfaces/IEmailService";
import { EmailService } from "../../bll/src/services/EmailService";

// Configuration de la base de données (pg Pool)
import { Pool } from "pg";
import { pool } from "../../dal/src/dal/config/db"; // Adapter selon votre structure

container.registerInstance<Pool>("DatabasePool", pool);

// Enregistrement du Unit of Work
container.register("UnitOfWork", { useClass: UnitOfWork });

container.register<IUnitOfWork>("IUnitOfWork", {
  useClass: UnitOfWork,
});

// Enregistrement des repositories
container.register<IUtilisateurRepository>("IUtilisateurRepository", {
  useClass: UtilisateurRepository,
});

container.register<IRepairRepository>("IReparationRepository", {
  useClass: RepairRepository,
});

container.register<IProductRepository>("IProductRepository", {
  useClass: ProductRepository,
});
container.register<ICommandRepository>("ICommandRepository", {
  useClass: CommandRepository,
});
container.register<IReviewRepository>("IReviewRepository", {
  useClass: ReviewRepository,
});

// Enregistrement des services
container.register<IUtilisateurService>("IUtilisateurService", {
  useClass: UtilisateurService,
});
container.register<IRepairService>("IReparationService", {
  useClass: RepairService,
});
container.register<IProductService>("IProductService", {
  useClass: ProductService,
});
container.register<ICommandService>("ICommandService", {
  useClass: CommandeService,
});
container.register<IReviewService>("IReviewService", {
  useClass: ReviewService,
});

// Enregistrer le PaymentService
container.register<IPaymentService>("IPaymentService", {
  useClass: PaymentService,
});

// Enregistrer EmailService
container.register<IEmailService>("IEmailService", { useClass: EmailService });

export { container };
