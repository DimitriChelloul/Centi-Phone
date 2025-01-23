import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { Pool, PoolClient } from "pg";
import { IUnitOfWork } from "../Interfaces/IUnitOfWork";
import { IUtilisateurRepository } from "../Interfaces/IUtilisateurRepository";
import { IRepairRepository } from "../Interfaces/IReparationRepository";
import { IProductRepository } from "../Interfaces/IProduitRepository";
import { ICommandRepository } from "../Interfaces/ICommandeRepository";
import { IReviewRepository } from "../Interfaces/IAvisRepository";

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private client!: PoolClient;

  utilisateurRepository: IUtilisateurRepository;
  repairRepository: IRepairRepository;
  productRepository: IProductRepository;
  commandRepository: ICommandRepository;
  reviewRepository: IReviewRepository;

  constructor(
    @inject("DatabasePool") private pool: Pool,
    @inject("IUtilisateurRepository") utilisateurRepository: IUtilisateurRepository,
    @inject("IReparationRepository") repairRepository: IRepairRepository,
    @inject("IProductRepository") productRepository: IProductRepository,
    @inject("ICommandRepository") commandRepository: ICommandRepository,
    @inject("IReviewRepository") reviewRepository: IReviewRepository
  ) {
    this.utilisateurRepository = utilisateurRepository;
    this.repairRepository = repairRepository;
    this.productRepository = productRepository;
    this.commandRepository = commandRepository;
    this.reviewRepository = reviewRepository;
  }

  async start(): Promise<void> {
    try {
      // Connecter au pool et démarrer une transaction
      this.client = await this.pool.connect();
      await this.client.query("BEGIN");

      // Initialiser les repositories avec le client
      await this.utilisateurRepository.initialize(this.client);
      await this.repairRepository.initialize(this.client);
      await this.productRepository.initialize(this.client);
      await this.commandRepository.initialize(this.client);
      await this.reviewRepository.initialize(this.client);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to start UnitOfWork transaction: ${error.message}`);
      } else {
        throw new Error(`Unknown error while starting UnitOfWork transaction: ${JSON.stringify(error)}`);
      }
    }
  }

  async commit(): Promise<void> {
    try {
      if (this.client) {
        await this.client.query("COMMIT");
        this.client.release();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to commit UnitOfWork transaction: ${error.message}`);
      } else {
        throw new Error(`Unknown error while committing UnitOfWork transaction: ${JSON.stringify(error)}`);
      }
    }
  }

  async rollback(): Promise<void> {
    try {
      if (this.client) {
        await this.client.query("ROLLBACK");
        this.client.release();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to rollback UnitOfWork transaction: ${error.message}`);
      } else {
        throw new Error(`Unknown error while rolling back UnitOfWork transaction: ${JSON.stringify(error)}`);
      }
    }
  }
}

