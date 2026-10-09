export const SAMPLE_CSV_FR = `ID,Nom,Département,Poste,Ville,Statut,Performance,Budget
101,Alexandre Martin,Direction,Directeur Général,Paris,Actif,98%,45000 €
102,Sophie Bernard,Finance,Responsable Comptable,Lyon,Actif,94%,28500 €
103,Thomas Dubois,Technique,Lead Développeur,Bordeaux,Actif,97%,35000 €
104,Émilie Moreau,Marketing,Chef de Projet Digital,Nantes,Actif,91%,18200 €
105,Lucas Petit,RH,Chargé de Recrutement,Lille,En attente,88%,12000 €
106,Camille Roux,Commercial,Account Manager,Marseille,Actif,95%,22000 €
107,Antoine Leroy,Technique,Architecte Cloud,Paris,Actif,99%,42000 €
108,Chloé Garcia,Design,Lead Product Designer,Lyon,Actif,96%,31000 €
109,Julien Fournier,Support,Responsable Clientèle,Toulouse,Actif,90%,19500 €
110,Manon Mercier,Finance,Contrôleur de Gestion,Strasbourg,Actif,93%,26000 €`;

export const SAMPLE_CSV_EN = `ID,Name,Department,Role,City,Status,Performance,Budget
101,Alexander Martin,Executive,Chief Executive Officer,London,Active,98%,£45,000
102,Sophie Bernard,Finance,Accounting Manager,Manchester,Active,94%,£28,500
103,Thomas Dubois,Engineering,Lead Developer,Bristol,Active,97%,£35,000
104,Emily Moreau,Marketing,Digital Project Lead,Edinburgh,Active,91%,£18,200
105,Lucas Petit,HR,Talent Acquisition Lead,Leeds,Pending,88%,£12,000
106,Camille Roux,Sales,Account Manager,Glasgow,Active,95%,£22,000
107,Anthony Leroy,Engineering,Cloud Architect,London,Active,99%,£42,000
108,Chloe Garcia,Design,Lead Product Designer,Manchester,Active,96%,£31,000
109,Julian Fournier,Support,Client Success Lead,Oxford,Active,90%,£19,500
110,Marion Mercier,Finance,Financial Controller,Cambridge,Active,93%,£26,000`;

export function formatTabularFileSize(bytes: number, isFr: boolean): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${isFr ? 'Ko' : 'KB'}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${isFr ? 'Mo' : 'MB'}`;
}
