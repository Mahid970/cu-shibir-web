import * as migration_20260926_133500_initial from './20260926_133500_initial';
import * as migration_20260926_170041_martyrs from './20260926_170041_martyrs';
import * as migration_20260926_235919_press_headline_en from './20260926_235919_press_headline_en';
import * as migration_20260927_005958_issues_desk from './20260927_005958_issues_desk';
import * as migration_20260927_011030_shuttle from './20260927_011030_shuttle';
import * as migration_20260927_012022_blood_network from './20260927_012022_blood_network';
import * as migration_20260927_053811_question_bank from './20260927_053811_question_bank';
import * as migration_20260927_065509_campus_places from './20260927_065509_campus_places';
import * as migration_20260927_065819_freshers_contacts from './20260927_065819_freshers_contacts';
import * as migration_20260930_211447_martyrs_journey from './20260930_211447_martyrs_journey';

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
  {
    up: migration_20260927_012022_blood_network.up,
    down: migration_20260927_012022_blood_network.down,
    name: '20260927_012022_blood_network',
  },
  {
    up: migration_20260927_053811_question_bank.up,
    down: migration_20260927_053811_question_bank.down,
    name: '20260927_053811_question_bank',
  },
  {
    up: migration_20260927_065509_campus_places.up,
    down: migration_20260927_065509_campus_places.down,
    name: '20260927_065509_campus_places',
  },
  {
    up: migration_20260927_065819_freshers_contacts.up,
    down: migration_20260927_065819_freshers_contacts.down,
    name: '20260927_065819_freshers_contacts',
  },
  {
    up: migration_20260930_211447_martyrs_journey.up,
    down: migration_20260930_211447_martyrs_journey.down,
    name: '20260930_211447_martyrs_journey',
  },
];
