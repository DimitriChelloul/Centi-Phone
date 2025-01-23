import multer from "multer";
import path from "path";
import fs from "fs";

// Vérifier ou créer le dossier uploads
//uploadDir :
//  Le chemin du dossier où les fichiers téléchargés seront stockés. 
// path.join(__dirname, "../../uploads") construit le chemin relatif à partir du répertoire actuel.
const uploadDir = path.join(__dirname, "../../uploads");
// Vérifie si le dossier uploads existe.
if (!fs.existsSync(uploadDir)) {
  // Si le dossier n'existe pas, il est créé de manière récursive.
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de Multer
// Configuration du stockage des fichiers téléchargés.
const storage = multer.diskStorage({
  // Fonction qui définit le dossier de destination pour les fichiers téléchargés. 
  destination: (req, file, cb) => {
    //cb(null, uploadDir) indique que les fichiers seront stockés dans le dossier uploads
    cb(null, uploadDir); // Dossier de destination
  },
  //filename : Fonction qui définit le nom de fichier unique pour chaque fichier téléchargé.
  filename: (req, file, cb) => {
    // Un suffixe unique basé sur l'heure actuelle et un nombre aléatoire.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // L'extension du fichier original.
    const extension = path.extname(file.originalname);
    // Le nom de fichier final est composé du nom du champ de formulaire, du suffixe unique et de l'extension du fichier.
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtrage des fichiers (uniquement les images)
// Fonction qui filtre les fichiers téléchargés pour n'autoriser que les images.
const fileFilter = (req: any, file: any, cb: any) => {

  //Vérifie si le type MIME du fichier commence par image/, ce qui indique que le fichier est une image.
  if (file.mimetype.startsWith("image/")) {
    // Si le fichier est une image, il est accepté.
    cb(null, true);
  } else {
    //Si le fichier n'est pas une image, une erreur est renvoyée et le fichier est rejeté.
    cb(new Error("Seules les images sont autorisées."), false);
  }
};

// Limiter la taille des fichiers à 5 Mo
// Configuration finale de Multer.

//storage : Utilise la configuration de stockage définie précédemment.
//fileFilter : Utilise le filtre de fichiers défini précédemment.
//limits : Limite la taille des fichiers téléchargés à 5 Mo (5 * 1024 * 1024 octets).
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
