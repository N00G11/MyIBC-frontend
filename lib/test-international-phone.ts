// Test des fonctions de validation et formatage internationales

import { validateInternationalPhone, autoFormatPhone } from './participant-utils';

// Tests pour validateInternationalPhone
console.log('=== Tests Validation Téléphone International ===');

// Tests positifs
console.log(validateInternationalPhone('+33 12 34 56 78 90')); // France
console.log(validateInternationalPhone('+49 123 456 789')); // Allemagne  
console.log(validateInternationalPhone('+1 234 567 8901')); // USA
console.log(validateInternationalPhone('+237 612 345 678')); // Cameroun
console.log(validateInternationalPhone('123456789')); // Local

// Tests négatifs
console.log(validateInternationalPhone('')); // Vide
console.log(validateInternationalPhone('12345')); // Trop court
console.log(validateInternationalPhone('abc123')); // Lettres

// Tests pour autoFormatPhone
console.log('\n=== Tests Auto-Format avec Espaces ===');

// Tests Cameroun (+237)
console.log('Cameroun:');
console.log('237' + ' → ' + autoFormatPhone('237', ''));
console.log('2376' + ' → ' + autoFormatPhone('2376', ''));
console.log('237612' + ' → ' + autoFormatPhone('237612', ''));
console.log('237612345' + ' → ' + autoFormatPhone('237612345', ''));
console.log('237612345678' + ' → ' + autoFormatPhone('237612345678', ''));

// Tests France (+33)
console.log('\nFrance:');
console.log('33' + ' → ' + autoFormatPhone('33', ''));
console.log('3312' + ' → ' + autoFormatPhone('3312', ''));
console.log('331234' + ' → ' + autoFormatPhone('331234', ''));
console.log('33123456' + ' → ' + autoFormatPhone('33123456', ''));
console.log('3312345678' + ' → ' + autoFormatPhone('3312345678', ''));
console.log('331234567890' + ' → ' + autoFormatPhone('331234567890', ''));

// Tests Allemagne (+49)
console.log('\nAllemagne:');
console.log('49' + ' → ' + autoFormatPhone('49', ''));
console.log('49123' + ' → ' + autoFormatPhone('49123', ''));
console.log('49123456' + ' → ' + autoFormatPhone('49123456', ''));
console.log('49123456789' + ' → ' + autoFormatPhone('49123456789', ''));

// Tests USA (+1)
console.log('\nUSA:');
console.log('1' + ' → ' + autoFormatPhone('1', ''));
console.log('1234' + ' → ' + autoFormatPhone('1234', ''));
console.log('1234567' + ' → ' + autoFormatPhone('1234567', ''));
console.log('12345678901' + ' → ' + autoFormatPhone('12345678901', ''));

/*
Résultats attendus:
Cameroun: +237 xxx xxx xxx
France: +33 xx xx xx xx xx
Allemagne: +49 xxx xxx xxx
USA: +1 xxx xxx xxxx
*/
