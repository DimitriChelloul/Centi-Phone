
import { Utilisateur } from "../domain/src/entities/Utilisateurs"; // Ajustez le chemin selon votre projet
import { JwtPayload } from "../api/src/types/types"; // Ajustez le chemin selon votre projet

declare global {
  namespace Express {
    interface Request {
      user?: Utilisateur | JwtPayload; // Combinez les types si nécessaire
    }
  }
}

