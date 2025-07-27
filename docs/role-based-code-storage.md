# Optimisation de la gestion des codes par rôle - Documentation

## Modifications apportées

### 1. **Fonction `saveAuthData` optimisée**
La fonction sauvegarde maintenant le code utilisateur avec un nom spécifique selon le rôle :

```typescript
// Pour les trésoriers
localStorage.setItem('tresorierCode', code);

// Pour les autres rôles
localStorage.setItem('code', code);
```

**Avantages :**
- Séparation claire des codes par rôle
- Évite les conflits lors des changements de rôle
- Facilite la maintenance et le debugging

### 2. **Nouvelle fonction `getUserCode`**
Récupère le code utilisateur selon le rôle spécifié :

```typescript
// Pour un trésorier
const tresorierCode = getUserCode('ROLE_TRESORIER');

// Pour les autres rôles (avec fallback automatique)
const userCode = getUserCode();
```

**Logique de récupération :**
- Si rôle = `ROLE_TRESORIER` → récupère `tresorierCode`
- Sinon → récupère `code` avec fallback sur `tresorierCode`

### 3. **Fonction `clearAuthData` améliorée**
Nettoie toutes les données d'authentification :

```typescript
clearAuthData(); // Supprime token, code ET tresorierCode
```

### 4. **Hook `useAuth` mis à jour**
- Import des nouvelles fonctions utilitaires
- Fonction `getCurrentUserCode` pour récupérer le code facilement
- Utilisation de `clearAuthData` lors de la déconnexion

### 5. **Formulaire de paiement optimisé**
Le composant `PayementForm` utilise maintenant :

```typescript
const storedTresorierCode = getUserCode('ROLE_TRESORIER');
```

Au lieu de :

```typescript
const storedTresorierCode = localStorage.getItem("code");
```

## Structure de stockage

### Avant
```
localStorage:
├── token: "jwt_token"
└── code: "user_code" (pour tous les rôles)
```

### Après
```
localStorage:
├── token: "jwt_token"
├── code: "user_code" (utilisateurs normaux, admins)
└── tresorierCode: "tresorier_code" (trésoriers uniquement)
```

## Avantages de cette optimisation

### 1. **Séparation des responsabilités**
- Chaque rôle a son propre espace de stockage pour le code
- Évite les conflits entre différents types d'utilisateurs

### 2. **Sécurité améliorée**
- Isolation des codes par rôle
- Nettoyage automatique lors des changements de rôle

### 3. **Maintenance facilitée**
- Code plus lisible et maintenable
- Fonctions utilitaires réutilisables
- Gestion centralisée du localStorage

### 4. **Compatibilité**
- Système de fallback pour la rétrocompatibilité
- Migration transparente pour les utilisateurs existants

### 5. **Debugging amélioré**
- Identification claire du type de code stocké
- Logs plus précis en cas d'erreur

## Utilisation pratique

### Dans un composant de trésorier
```typescript
import { getUserCode } from '@/lib/auth-utils';

const tresorierCode = getUserCode('ROLE_TRESORIER');
```

### Dans un composant générique
```typescript
import { useAuth } from '@/hooks/use-auth';

const { getCurrentUserCode } = useAuth();
const userCode = getCurrentUserCode(); // Détection automatique du rôle
```

### Nettoyage lors de la déconnexion
```typescript
import { clearAuthData } from '@/lib/auth-utils';

clearAuthData(); // Supprime tous les codes et le token
```

Cette optimisation garantit une gestion plus robuste et sécurisée des codes utilisateur selon leur rôle dans l'application.
