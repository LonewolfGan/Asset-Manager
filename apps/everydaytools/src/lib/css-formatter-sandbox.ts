export type ViewOutput = 'code' | 'sandbox';
export type DeviceWidth = 'desktop' | 'tablet' | 'mobile';

export function generateCssSandboxHtml(appliedCss: string, isFr: boolean): string {
  return `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      background-color: #fafafa;
      line-height: 1.5;
    }
    .preview-container {
      max-width: 680px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .preview-section {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 24px;
    }
    .preview-header { margin-top: 0; margin-bottom: 8px; }
    .preview-meta { font-size: 13px; color: #71717a; margin-top: 0; margin-bottom: 18px; }
    .preview-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    .preview-field { margin-bottom: 16px; }
    .preview-field label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #3f3f46; }
    .preview-field input[type="text"] { width: 100%; padding: 8px 12px; border: 1px solid #d4d4d8; border-radius: 6px; font-size: 14px; }
    table.preview-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
    table.preview-table th, table.preview-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e4e4e7; }
    table.preview-table th { font-weight: 600; color: #71717a; }
  </style>
  <style id="user-injected-css">
    ${appliedCss}
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-section card">
      <h2 class="preview-header title">${isFr ? 'Composants & Éléments UI' : 'UI Components & Elements'}</h2>
      <p class="preview-meta subtitle">${
        isFr
          ? 'Visualisez immédiatement vos classes CSS (.btn, .card, .badge, .alert, input, table...)'
          : 'Preview your CSS classes immediately (.btn, .card, .badge, .alert, input, table...)'
      }</p>
      <div class="preview-row">
        <button class="btn btn-primary">${isFr ? 'Bouton Principal' : 'Primary Button'}</button>
        <button class="btn btn-secondary">${isFr ? 'Bouton Secondaire' : 'Secondary Button'}</button>
        <button class="btn">${isFr ? 'Bouton Standard' : 'Standard Button'}</button>
      </div>
      <div class="preview-row">
        <span class="badge badge-primary">${isFr ? 'Tag Principal' : 'Primary Tag'}</span>
        <span class="badge badge-success">${isFr ? 'En ligne' : 'Online'}</span>
        <span class="badge">${isFr ? 'Badge Simple' : 'Simple Badge'}</span>
      </div>
      <div class="preview-field form-group">
        <label for="sample-input">${isFr ? 'Champ de saisie' : 'Input field'}</label>
        <input type="text" id="sample-input" class="input form-control" placeholder="${
          isFr ? 'Entrez une valeur de test...' : 'Enter test value...'
        }" />
      </div>
      <div class="alert alert-info">
        ${isFr ? "Notification ou bloc d'alerte stylisé (.alert, .alert-info)" : 'Styled notification or alert block (.alert, .alert-info)'}
      </div>
      <table class="table preview-table">
        <thead>
          <tr>
            <th>${isFr ? 'Propriété' : 'Property'}</th>
            <th>${isFr ? 'Type' : 'Type'}</th>
            <th>${isFr ? 'Statut' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${isFr ? 'Feuille de style' : 'Stylesheet'}</td>
            <td>CSS3 / Modern</td>
            <td>${isFr ? 'Appliqué' : 'Applied'}</td>
          </tr>
          <tr>
            <td>${isFr ? 'Palette chromatique' : 'Color palette'}</td>
            <td>Variables CSS</td>
            <td>${isFr ? 'Actif' : 'Active'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}
