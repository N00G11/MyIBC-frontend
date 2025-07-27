# Pages d'authentification restructurées

## Architecture par composants

Les pages d'authentification ont été restructurées pour suivre l'architecture par composants utilisée dans l'application, notamment comme dans la page des trésoriers.

### Structure

```
components/auth/
├── index.ts                    # Exports des composants
├── login-form.tsx             # Composant formulaire de connexion
├── register-form.tsx          # Composant formulaire d'inscription
└── forgot-password-form.tsx   # Composant formulaire mot de passe oublié

app/auth/
├── login/page.tsx             # Page de connexion (utilise LoginForm)
├── register/page.tsx          # Page d'inscription (utilise RegisterForm)
└── forgot-password/page.tsx   # Page mot de passe oublié (utilise ForgotPasswordForm)
```

### Avantages de cette architecture

1. **Séparation des responsabilités** : Les pages gèrent uniquement la mise en page et les titres
2. **Réutilisabilité** : Les composants de formulaires peuvent être réutilisés ailleurs
3. **Maintenance** : Code plus modulaire et facile à maintenir
4. **Testabilité** : Les composants peuvent être testés indépendamment
5. **Cohérence** : Architecture uniforme avec le reste de l'application

### Composants créés

#### LoginForm
- Gère la connexion par téléphone ou code MyIBC
- Validation des formulaires
- Gestion des états de chargement
- Navigation vers les autres pages

#### RegisterForm
- Inscription complète avec validation
- Validation de la force du mot de passe
- Gestion des pays et téléphones
- Acceptation des conditions

#### ForgotPasswordForm
- Processus en 2 étapes
- Vérification d'identité puis nouveau mot de passe
- Support téléphone et code MyIBC
- Interface progressive

### Migration effectuée

- ✅ Pages originales sauvegardées avec suffix `-old.tsx`
- ✅ Nouvelles pages basées sur les composants
- ✅ Toutes les fonctionnalités préservées
- ✅ Theme MyIBC maintenu
- ✅ Validation TypeScript complète
- ✅ Architecture cohérente avec l'application

Les anciennes pages monolithiques sont disponibles dans les fichiers `*-old.tsx` pour référence.
