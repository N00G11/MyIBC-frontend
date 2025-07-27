/**
 * Tests pour les fonctions de validation après suppression des contraintes de mot de passe
 */

import { validatePassword } from '../lib/auth-utils';

// Tests de validation du mot de passe
console.log('=== Tests de validation du mot de passe ===');

// Test 1: Mot de passe vide (devrait échouer)
const test1 = validatePassword('');
console.log('Mot de passe vide:', test1);
// Attendu: { isValid: false, message: 'Le mot de passe est requis.' }

// Test 2: Mot de passe d'un caractère (devrait maintenant passer)
const test2 = validatePassword('a');
console.log('Mot de passe 1 caractère:', test2);
// Attendu: { isValid: true }

// Test 3: Mot de passe de 3 caractères (devrait maintenant passer)
const test3 = validatePassword('abc');
console.log('Mot de passe 3 caractères:', test3);
// Attendu: { isValid: true }

// Test 4: Mot de passe de 6 caractères (devrait passer)
const test4 = validatePassword('abcdef');
console.log('Mot de passe 6 caractères:', test4);
// Attendu: { isValid: true }

// Test 5: Mot de passe très court avec caractères spéciaux (devrait maintenant passer)
const test5 = validatePassword('!@');
console.log('Mot de passe 2 caractères spéciaux:', test5);
// Attendu: { isValid: true }

console.log('=== Résumé ===');
console.log('Les utilisateurs peuvent maintenant utiliser des mots de passe de toute longueur,');
console.log('seule la présence d\'un mot de passe est requise.');
