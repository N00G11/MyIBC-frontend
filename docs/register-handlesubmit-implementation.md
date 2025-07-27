# Implémentation de la fonction handleSubmit pour l'inscription

## Vue d'ensemble

La fonction `handleSubmit` du composant `RegisterForm` a été implémentée pour gérer l'inscription des nouveaux utilisateurs selon vos spécifications.

## Fonctionnalités

### 1. Structure des données envoyées

La fonction envoie les données suivantes à l'endpoint d'inscription :

```javascript
{
  username: "Prenom Nom",        // Combinaison prénom + nom
  phoneNumber: "+33123456789",   // Numéro complet avec indicatif
  country: "France",             // Nom du pays sélectionné
  password: "motdepasse123"      // Mot de passe choisi
}
```

### 2. Endpoint utilisé

- **Pour l'inscription** : `POST /auth/register`

### 3. Structure de la réponse serveur

La fonction attend une réponse du serveur avec la même structure que le login :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ROLE_UTILISATEUR",  // Toujours ROLE_UTILISATEUR pour l'inscription
  "code": "ABC123XYZ",
  "type": "Bearer"
}
```

### 4. Stockage automatique

Pour l'inscription, le code est automatiquement stocké avec le nom `"code"` dans le localStorage car le rôle est toujours `ROLE_UTILISATEUR` :

```javascript
localStorage.setItem('token', authData.token);
localStorage.setItem('code', authData.code);
```

### 5. Redirection automatique

Après une inscription réussie, l'utilisateur est automatiquement redirigé vers `/utilisateur/dashboard` (rôle ROLE_UTILISATEUR par défaut).

## Exemple de payload d'inscription

```javascript
// Exemple avec un utilisateur français
{
  username: "Jean Dupont",
  phoneNumber: "+33123456789",
  country: "France", 
  password: "MonMotDePasse123"
}

// Exemple avec un utilisateur camerounais
{
  username: "Marie Ngono",
  phoneNumber: "+237698765432",
  country: "Cameroun",
  password: "MotDePasseSecurise456"
}
```

## Gestion des erreurs

La fonction utilise les mêmes utilitaires que le login pour une gestion cohérente :

- `parseAuthError()` : Parse et normalise les erreurs
- `validateAuthResponse()` : Valide la structure de la réponse
- `saveAuthData()` : Gère le stockage sécurisé
- `getRedirectPath()` : Détermine la route de redirection

### Types d'erreurs gérées

- **400** : Données invalides (validation échouée)
- **409** : Conflit (numéro de téléphone déjà utilisé)
- **500** : Erreur serveur
- **Réseau** : Problèmes de connexion

## Validation côté client

Avant l'envoi, la fonction valide :

- ✅ Nom et prénom (minimum 2 caractères chacun)
- ✅ Pays sélectionné
- ✅ Numéro de téléphone (chiffres uniquement)
- ✅ Force du mot de passe (8 caractères, majuscule, minuscule, chiffre)
- ✅ Confirmation du mot de passe
- ✅ Acceptation des conditions d'utilisation

## Sécurité

- Validation robuste côté client
- Utilisation d'axiosInstance avec intercepteurs
- Gestion sécurisée des erreurs sans exposition d'informations sensibles
- Stockage automatique et sécurisé des tokens

## Flux complet

1. **Validation** → Vérification des données côté client
2. **Envoi** → POST vers `/auth/register` avec username, phoneNumber, country, password
3. **Réponse** → Réception du token, code, et rôle (ROLE_UTILISATEUR)
4. **Stockage** → Sauvegarde automatique dans localStorage
5. **Redirection** → Vers `/utilisateur/dashboard`

L'implémentation est maintenant cohérente avec celle du login et utilise les mêmes utilitaires d'authentification pour une expérience utilisateur unifiée.
