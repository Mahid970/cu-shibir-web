import * as migration_20260926_133500_initial from './20260926_133500_initial';

export const migrations = [
  {
    up: migration_20260926_133500_initial.up,
    down: migration_20260926_133500_initial.down,
    name: '20260926_133500_initial'
  },
];
