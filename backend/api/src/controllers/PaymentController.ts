import { Request, Response } from "express";
import { container } from "tsyringe";
import { IPaymentService } from "../../../bll/src/Interfaces/IPaymentService";


//définit une fonction asynchrone createPayment qui prend deux arguments : req (de type Request) et res (de type Response)
export const createPayment = async (req: Request, res: Response) => {
  //déstructure le corps de la requête (req.body) pour extraire les propriétés commandeId, amount, et currency
  const { commandeId, amount, currency } = req.body;
  //utilise le conteneur de dépendances pour résoudre une instance de IPaymentService
  const paymentService = container.resolve<IPaymentService>("IPaymentService");

  try {
    //essaie d'appeler la méthode processPayment du service de paiement avec les paramètres commandeId, amount, et currency
    const clientSecret = await paymentService.processPayment(commandeId, amount, currency);
    //Si l'appel réussit, il renvoie une réponse JSON avec le clientSecret
    res.status(200).json({ clientSecret });
  } catch (error) {
    //Si une erreur se produit, il renvoie une réponse JSON avec un message d'erreur et un statut 500
    res.status(500).json({ message: (error as Error).message });
  }
};

//définit une fonction asynchrone validatePayment qui prend deux arguments : req (de type Request) et res (de type Response)
export const validatePayment = async (req: Request, res: Response) => {
  //déstructure le corps de la requête (req.body) pour extraire la propriété commandeId.
  const { commandeId } = req.body;
  // utilise le conteneur de dépendances pour résoudre une instance de IPaymentService,
  const paymentService = container.resolve<IPaymentService>("IPaymentService");

  try {
    //essaie d'appeler la méthode validatePayment du service de paiement avec le paramètre commandeId
    await paymentService.validatePayment(commandeId);
    //Si l'appel réussit, il renvoie une réponse JSON avec un message de succès
    res.status(200).json({ message: "Paiement validé avec succès." });
  } catch (error) {
    //Si une erreur se produit, il renvoie une réponse JSON avec un message d'erreur et un statut 500.
    res.status(500).json({ message: (error as Error).message });
  }
};
