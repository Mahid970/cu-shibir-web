import * as migration_20260926_133500_initial from './20260926_133500_initial';
import * as migration_20260926_170041_martyrs from './20260926_170041_martyrs';
import * as migration_20260926_235919_press_headline_en from './20260926_235919_press_headline_en';
import * as migration_20260927_005958_issues_desk from './20260927_005958_issues_desk';
import * as migration_20260927_011030_shuttle from './20260927_011030_shuttle';

export const migrations = [
  {
    up: migration_20260926_133500_initial.up,
    down: migration_20260926_133500_initial.down,
    name: '20260926_133500_initial',
  },
  {
    up: migration_20260926_170041_martyrs.up,
    down: migration_20260926_170041_martyrs.down,
    name: '20260926_170041_martyrs',
  },
  {
    up: migration_20260926_235919_press_headline_en.up,
    down: migration_20260926_235919_press_headline_en.down,
    name: '20260926_235919_press_headline_en',
  },
  {
    up: migration_20260927_005958_issues_desk.up,
    down: migration_20260927_005958_issues_desk.down,
    name: '20260927_005958_issues_desk',
  },
  {
    up: migration_20260927_011030_shuttle.up,
    down: migration_20260927_011030_shuttle.down,
    name: '20260927_011030_shuttle',
  },
];
