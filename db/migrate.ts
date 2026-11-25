import { urlBaseDeDatos } from '../src/shared/config.ts';
import { prepararBase } from './herramientas.ts';

await prepararBase(urlBaseDeDatos('DATABASE_URL_MIGRACIONES'), urlBaseDeDatos('DATABASE_URL'));
console.log('Migraciones aplicadas.');
