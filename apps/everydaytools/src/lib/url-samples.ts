export interface UrlSample {
  id: string;
  titleFr: string;
  titleEn: string;
  url: string;
  descriptionFr: string;
  descriptionEn: string;
}

export const URL_SAMPLES: UrlSample[] = [
  {
    id: 'search',
    titleFr: 'Recherche E-Commerce Multi-Critères',
    titleEn: 'Multi-Filter E-Commerce Search',
    url: 'https://store.example.com/fr/catalogue?category=vêtements&filter=prix<50€&tags=nouveauté,été&sort=desc#top',
    descriptionFr: 'URL avec caractères accentués, symboles monétaires et paramètres multiples',
    descriptionEn: 'URL with accented characters, currency symbols and multiple query parameters',
  },
  {
    id: 'oauth',
    titleFr: 'Redirection OAuth2 / OpenID Connect',
    titleEn: 'OAuth2 / OpenID Connect Redirect',
    url: 'https://auth.example.com/oauth/authorize?response_type=code&client_id=client_987xyz&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback&scope=openid%20profile%20email&state=xyz123_sec!#auth',
    descriptionFr: 'URL OAuth2 avec redirect_uri imbriquée et scopes délimités par espaces encodés',
    descriptionEn: 'OAuth2 URL with nested encoded redirect URI and space-separated scopes',
  },
  {
    id: 'api',
    titleFr: 'Endpoint API REST avec Filtres JSON',
    titleEn: 'REST API Endpoint with JSON Filter',
    url: 'https://api.example.com/v1/users?fields=id,name,email,role&filter={"status":"active","age":{"$gte":18}}&page=1&limit=25',
    descriptionFr: 'Requête API avec objet JSON complexe passé dans la query string',
    descriptionEn: 'API query with nested JSON filter object in query string',
  },
];
