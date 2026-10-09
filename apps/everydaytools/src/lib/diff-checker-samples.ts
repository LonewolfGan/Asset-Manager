/**
 * Sample datasets for rapid comparison testing in Diff Checker
 */
export const DIFF_SAMPLES = {
  text: {
    name: 'Texte narratif',
    a: `Le développement web moderne exige performance et accessibilité.
Chaque outil doit offrir une interface soignée et sans temps mort.
Les utilisateurs méritent des applications respectueuses de leur vie privée.
Cette version a été livrée en 2025.`,
    b: `Le développement web moderne exige une performance maximale et une accessibilité irréprochable.
Chaque outil doit offrir une interface ergonomique et sans aucun temps mort.
Les utilisateurs exigent des applications privées, rapides et sans pistage.
Cette version finale a été publiée en 2026.`,
  },
  code: {
    name: 'Code TypeScript',
    a: `function calculateTotal(items: CartItem[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
    b: `function calculateTotal(items: CartItem[], discountRate = 0): number {
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);
  const discount = subtotal * discountRate;
  return Math.round((subtotal - discount) * 100) / 100;
}`,
  },
  json: {
    name: 'Fichier JSON',
    a: `{
  "name": "EverydayTools",
  "version": "1.0.0",
  "features": ["pdf", "images"],
  "debug": true
}`,
    b: `{
  "name": "EverydayTools Pro",
  "version": "2.0.0",
  "features": ["pdf", "images", "formatters", "calculators"],
  "debug": false,
  "license": "MIT"
}`,
  },
};
