import * as migration_20251223_205825_initial from './20251223_205825_initial';

export const migrations = [
  {
    up: migration_20251223_205825_initial.up,
    down: migration_20251223_205825_initial.down,
    name: '20251223_205825_initial',
  },
];
