import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
