/**
 * Standard RFC 7519 registered claims descriptions and real-world JWT samples.
 */

export const RFC_7519_CLAIMS: Record<string, { label: string; description: string; type: string }> = {
  iss: {
    label: 'Issuer (Émetteur)',
    description: "Identifie le fournisseur d'identité ou le service qui a généré et émis le jeton.",
    type: 'string',
  },
  sub: {
    label: 'Subject (Sujet)',
    description: "Identifie l'entité principale ciblée par le jeton (ex. identifiant d'utilisateur).",
    type: 'string',
  },
  aud: {
    label: 'Audience (Destinataire)',
    description: 'Désigne les services, API ou domaines récipiendaires auxquels ce jeton est destiné.',
    type: 'string | string[]',
  },
  exp: {
    label: 'Expiration Time (Expiration)',
    description: 'Horodatage Unix (secondes) après lequel le jeton ne doit plus être accepté.',
    type: 'number (Unix Timestamp)',
  },
  nbf: {
    label: 'Not Before (Date d’effet)',
    description: 'Horodatage Unix (secondes) avant lequel le jeton ne doit pas être considéré comme valide.',
    type: 'number (Unix Timestamp)',
  },
  iat: {
    label: 'Issued At (Émis le)',
    description: 'Horodatage Unix (secondes) marquant le moment précis où le jeton a été émis.',
    type: 'number (Unix Timestamp)',
  },
  jti: {
    label: 'JWT ID (Identifiant unique)',
    description: 'Identifiant cryptographique unique pour prévenir les attaques par rejeu (replay attacks).',
    type: 'string (UUID / Hash)',
  },
};

export const SAMPLE_JWTS = {
  activeAdmin:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMSIsIm5hbWUiOiJBbGV4YW5kcmUgTWFydGluIiwiZXhwIjoyMDAwMDAwMDAwLCJpYXQiOjE2MDAwMDAwMDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  expiredUser:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMiIsIm5hbWUiOiJTb3BoaWUgTWFydGluIiwiZXhwIjoxNTAwMDAwMDAwLCJpYXQiOjE0MDAwMDAwMDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  supabaseAuth: {
    name: 'Supabase Auth',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3Quc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImQzYjA3Mzg0LWQxMTMtNGE3Yi1hMmM5LTE2YThkNjcyNThlMiIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjE3OTA4NjM3NzUsImlhdCI6MTc5MDI0NDU3NSwiZW1haWwiOiJhbGV4YW5kcmUubWFydGluQGNvbXBhbnkuaW8iLCJwaG9uZSI6IiIsInJvbGUiOiJhdXRoZW50aWNhdGVkIn0.K8aW3V2Z5U9_sample_sig_valid',
    secret: 'supabase-super-secret-jwt-token-key-32chars',
    provider: 'Supabase',
    description: 'Jeton utilisateur Supabase complet avec métadonnées et rôles.',
  },
  auth0Admin: {
    name: 'Auth0 Management API',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXZlcnlkYXl0b29scy5kZXYvIiwic3ViIjoiYXV0aDB8NjRmMWEyYjNjNGQ1ZTZmN2E4YjljMGQxIiwiYXVkIjpbImh0dHBzOi8vYXBpLmV2ZXJ5ZGF5dG9vbHMuZGV2L3YyLyJdLCJpYXQiOjE3OTAyMTU3NzUsImV4cCI6MTc5Mjg1MDk3NSwic2NvcGUiOiJyZWFkOnJlcG9ydHMgYWRtaW46YWxsIn0.sSampleSigAuth0_123',
    secret: 'auth0-management-api-secret-key-prod',
    provider: 'Auth0',
    description: 'Jeton API Auth0 avec scopes étendus et permissions.',
  },
  expiredSession: {
    name: 'Session Expirée',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXZlcnlkYXl0b29scy5kZXYiLCJzdWIiOiJ1c3JfbGVnYWN5XzQ4MTAyIiwiZXhwIjoxNzg4OTYyOTc1LCJpYXQiOjE3ODUwNzQ5NzV9.yVmMXuQneu010uDnAjdIxPzJywH6OiuaMWIiGA4FuR4',
    secret: 'old-session-secret-expired',
    provider: 'Standard',
    description: 'Jeton dont la date d’expiration (exp) est échue.',
  },
  insecureNone: {
    name: 'CVE Algorithme "none"',
    token:
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL3Z1bG5lcmFibGUtYXV0aC5uZXQiLCJzdWIiOiJyb290X2FkbWluaXN0cmF0b3IiLCJhZG1pbiI6dHJ1ZSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc5MDI1NzE3NSwiZXhwIjoxNzkwMzQ1Mzc1fQ.',
    secret: '',
    provider: 'Test Vulnérabilité',
    description: 'Jeton sans signature exploitant la faille de contournement.',
  },
};
