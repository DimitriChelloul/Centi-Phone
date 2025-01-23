import { Request, Response, NextFunction, RequestHandler } from "express";


//asyncHandler est une fonction qui prend un argument fn de type RequestHandler.
//Elle retourne une nouvelle fonction middleware de type RequestHandler.
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  //a nouvelle fonction middleware prend trois arguments : req (la requête), res (la réponse), et next (la fonction pour passer au prochain middleware).
  return (req: Request, res: Response, next: NextFunction) => {
    // Cette ligne appelle la fonction fn avec les arguments req, res, et next, et enveloppe le résultat dans une promesse. Si fn retourne une promesse, 
    // Promise.resolve retourne cette promesse. Si fn retourne une valeur non-promesse, Promise.resolve crée une promesse résolue avec cette valeur.
    // Si la promesse est rejetée (c'est-à-dire si une erreur se produit dans fn),
    //  l'erreur est capturée et passée à la fonction next. Cela permet de gérer les erreurs de manière centralisée dans Express.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
