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
var _a;
import { injectable, inject } from "tsyringe";
import { IReviewRepository } from "../../../dal/src/dal/Interfaces/IAvisRepository";
let ReviewService = class ReviewService {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    async createReview(utilisateurId, avis) {
        avis.utilisateurId = utilisateurId;
        avis.dateCreation = new Date();
        return this.reviewRepo.createReview(avis);
    }
    async getReviewsByProductId(productId, type) {
        return this.reviewRepo.getReviewsByProductId(productId, type);
    }
    async getReviewById(reviewId) {
        return this.reviewRepo.getReviewById(reviewId);
    }
    async deleteReview(reviewId) {
        await this.reviewRepo.deleteReview(reviewId);
    }
};
ReviewService = __decorate([
    injectable(),
    __param(0, inject("IReviewRepository")),
    __metadata("design:paramtypes", [typeof (_a = typeof IReviewRepository !== "undefined" && IReviewRepository) === "function" ? _a : Object])
], ReviewService);
export { ReviewService };
