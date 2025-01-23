var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { Pool } from "pg";
import { UtilisateurRepository } from "../repositories/UtilisateurRepository";
import { RepairRepository } from "../repositories/ReparationRepository";
import { ProductRepository } from "../repositories/ProduitRepository";
import { CommandRepository } from "../repositories/CommandeRepository";
import { ReviewRepository } from "../repositories/AvisRepository";
let UnitOfWork = class UnitOfWork {
    constructor(pool, utilisateurRepository, repairRepository, productRepository, commandRepository, reviewRepository) {
        this.pool = pool;
        this.utilisateurRepository = utilisateurRepository;
        this.repairRepository = repairRepository;
        this.productRepository = productRepository;
        this.commandRepository = commandRepository;
        this.reviewRepository = reviewRepository;
    }
    async start() {
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to start UnitOfWork transaction: ${error.message}`);
            }
            else {
                throw new Error(`Unknown error while starting UnitOfWork transaction: ${JSON.stringify(error)}`);
            }
        }
    }
    async commit() {
        try {
            if (this.client) {
                await this.client.query("COMMIT");
                this.client.release();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to commit UnitOfWork transaction: ${error.message}`);
            }
            else {
                throw new Error(`Unknown error while committing UnitOfWork transaction: ${JSON.stringify(error)}`);
            }
        }
    }
    async rollback() {
        try {
            if (this.client) {
                await this.client.query("ROLLBACK");
                this.client.release();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to rollback UnitOfWork transaction: ${error.message}`);
            }
            else {
                throw new Error(`Unknown error while rolling back UnitOfWork transaction: ${JSON.stringify(error)}`);
            }
        }
    }
};
UnitOfWork = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __param(1, inject("UtilisateurRepository")),
    __param(2, inject("RepairRepository")),
    __param(3, inject("ProductRepository")),
    __param(4, inject("CommandRepository")),
    __param(5, inject("ReviewRepository")),
    __metadata("design:paramtypes", [Pool, typeof (_a = typeof UtilisateurRepository !== "undefined" && UtilisateurRepository) === "function" ? _a : Object, typeof (_b = typeof RepairRepository !== "undefined" && RepairRepository) === "function" ? _b : Object, typeof (_c = typeof ProductRepository !== "undefined" && ProductRepository) === "function" ? _c : Object, typeof (_d = typeof CommandRepository !== "undefined" && CommandRepository) === "function" ? _d : Object, typeof (_e = typeof ReviewRepository !== "undefined" && ReviewRepository) === "function" ? _e : Object])
], UnitOfWork);
export { UnitOfWork };
