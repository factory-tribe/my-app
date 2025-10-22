import * as migration_20251001_113348 from './20251001_113348';
import * as migration_20251006_173326 from './20251006_173326';

export const migrations = [
  {
    up: migration_20251001_113348.up,
    down: migration_20251001_113348.down,
    name: '20251001_113348',
  },
  {
    up: migration_20251006_173326.up,
    down: migration_20251006_173326.down,
    name: '20251006_173326'
  },
];
