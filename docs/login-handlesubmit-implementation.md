# Implémentation de la fonction handleSubmit pour l'authentification

## Vue d'ensemble

La fonction `handleSubmit` du composant `LoginForm` a été implémentée pour gérer l'authentification avec différents modes de connexion selon vos spécifications.

## Fonctionnalités

### 1. Modes de connexion supportés

- **Connexion par téléphone** : Téléphone + mot de passe
- **Connexion par code MyIBC** : Code personnel + mot de passe

### 2. Endpoints utilisés

- **Pour la connexion par téléphone** : `POST /auth/login/phone`
- **Pour la connexion par code** : `POST /auth/login/code`

### 3. Structure de la réponse serveur

La fonction attend une réponse du serveur avec la structure suivante :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ROLE_UTILISATEUR", // ou "ROLE_TRESORIER", "ROLE_ADMIN"
  "code": "ABC123XYZ",
  "type": "Bearer"
}
```

### 4. Stockage sécurisé par rôle

Le code est stocké dans le localStorage avec un nom différent selon le rôle :

- **ROLE_UTILISATEUR** : `localStorage.setItem('code', authData.code)`
- **ROLE_TRESORIER** : `localStorage.setItem('tresorierCode', authData.code)`
- **Autres rôles** : `localStorage.setItem('code', authData.code)` (par défaut)

### 5. Redirection automatique

Après une connexion réussie, l'utilisateur est automatiquement redirigé selon son rôle :

- **ROLE_UTILISATEUR** → `/utilisateur/dashboard`
- **ROLE_TRESORIER** → `/tresoriers`
- **ROLE_ADMIN** → `/admin/dashboard`

## Code d'exemple

### Payload pour connexion par téléphone

```javascript
{
  phoneNumber: "+33123456789",
  password: "motdepasse123",
  country: "France"
}
```

### Payload pour connexion par code

```javascript
{
  code: "ABC123XYZ",
  password: "motdepasse123"
}
```

## Utilitaires utilisés

La fonction utilise les utilitaires d'authentification existants dans `lib/auth-utils.ts` :

- `validateAuthResponse()` : Valide la structure de la réponse
- `saveAuthData()` : Gère le stockage sécurisé selon le rôle
- `getRedirectPath()` : Détermine la route de redirection
- `parseAuthError()` : Parse et normalise les erreurs

## Gestion des erreurs

La fonction gère automatiquement :

- Les erreurs de validation côté client
- Les erreurs de réseau
- Les erreurs de serveur (400, 401, 404, 409, 429, 500)
- Les erreurs de format de réponse

## Sécurité

- Validation des données côté client avant envoi
- Nettoyage automatique des anciens tokens lors du changement de rôle
- Gestion sécurisée des erreurs sans exposer d'informations sensibles
- Utilisation d'axiosInstance avec intercepteurs configurés

## Utilisation

La fonction est déjà intégrée dans le composant `LoginForm` et se déclenche automatiquement lors de la soumission du formulaire. Aucune configuration supplémentaire n'est nécessaire.
