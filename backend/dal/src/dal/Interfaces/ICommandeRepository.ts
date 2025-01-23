import { PoolClient } from 'pg';
import { Commande } from '../../../../domain/src/entities/commandes';
import { CommandDetail } from '../../../../domain/src/entities/details_commandes';
import { Livraison } from '../../../../domain/src/entities/livraisons';
import { OptionsDeLivraison } from '../../../../domain/src/entities/options_livraison';

export interface ICommandRepository {
  initialize(client: PoolClient): unknown;
  // Gestion des commandes
  createCommand(command: Commande): Promise<Commande>;
  getCommandById(id: number): Promise<Commande | null>;
  getCommandsByUserId(userId: number): Promise<Commande[]>;
  deleteCommand(id: number): Promise<void>;
  updateStatutPaiement(commandeId: number, statut: string): Promise<void> ;

  // Gestion des détails de commande
  getCommandDetails(commandId: number): Promise<CommandDetail[]>;
  addCommandDetail(detail: CommandDetail): Promise<CommandDetail>;

  // Gestion des livraisons
  createLivraison(delivery: Livraison): Promise<Livraison>;
  getLivraisonByCommandId(commandId: number): Promise<Livraison | null>;
  getAllDeliveryOptions(): Promise<OptionsDeLivraison[]>;
}
