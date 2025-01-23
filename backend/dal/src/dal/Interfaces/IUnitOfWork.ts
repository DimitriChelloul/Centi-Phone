import { PoolClient } from "pg";
import { IUtilisateurRepository } from "../Interfaces/IUtilisateurRepository";
import { IRepairRepository } from "../Interfaces/IReparationRepository";
import { IProductRepository } from "../Interfaces/IProduitRepository";
import { ICommandRepository } from "../Interfaces/ICommandeRepository";
import { IReviewRepository } from "../Interfaces/IAvisRepository";

export interface IUnitOfWork {
  utilisateurRepository: IUtilisateurRepository;
  repairRepository: IRepairRepository;
  productRepository: IProductRepository;
  commandRepository: ICommandRepository;
  reviewRepository: IReviewRepository;

  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
