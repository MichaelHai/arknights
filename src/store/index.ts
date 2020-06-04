import Vue from 'vue';
import Vuex, {Plugin, StoreOptions} from 'vuex';
import VuexPersist from 'vuex-persist';
import {AllProfessions, CharacterDetail, Characters, Profession} from '@/model';
import {Moment} from 'moment-timezone/moment-timezone';

Vue.use(Vuex);

const vuexPersist = new VuexPersist<ArknightsState>({
  key: 'arknights',
  storage: window.localStorage,
  reducer: (state) => {
    const persisted: { [key: string]: any } = {};
    (Object.keys(state) as Array<keyof ArknightsState>)
      .filter((key: keyof ArknightsState) => key !== 'uiControl')
      .forEach((key: keyof ArknightsState) => {
        persisted[key] = state[key];
      });
    persisted.uiControl = {};
    persisted.uiControl.characterFilter = state.uiControl.characterFilter;
    return persisted;
  },
});

export interface ArknightsState {
  itemCounts: { [item: string]: number };
  characterData: { [character: string]: CharacterData };
  homeCharacterId: string | null;
  missions: {
    daily: { [day: string]: Array<boolean> }
    weekly: { [week: string]: Array<boolean> }
  };
  checkin: { [day: string]: boolean };
  uiControl: UIControl;
}

export interface UIControl {
  itemDialog: {
    shown: boolean;
    item: string | null;
  },
  lootDialog: {
    shown: boolean;
    stage: string | null;
  },
  characterFilter: {
    nameFilter: string;
    professionExcluded: { [profession: string]: boolean };
    rarityExcluded: Array<boolean>;
    showNontarget: boolean;
  },
  compositeBonus: {
    snackbar: boolean;
    items: Array<string>;
  }
}

export interface CharacterData {
  level: number;
  phase: PhaseLevel;
  allSkillLevel: AllSkillLevel;
  skillLevel: { [skillId: string]: SkillLevel };
  planned: {
    level: number;
    phase: PhaseLevel;
    allSkillLevel: AllSkillLevel;
    skillLevel: { [skillId: string]: SkillLevel };
  }
}

export type SkillLevel = 0 | 1 | 2 | 3;

export enum Mutations {
  ChangeItem = 'ChangeItem',
  SetItemCount = 'SetItemCount',
  SetHomeCharacter = 'SetHomeCharacter',
  SetPlannedPhase = 'SetPlannedPhase',
  SetPhase = 'SetPhase',
  SetAllSkillLevel = 'SetAllSkillLevel',
  SetPlannedAllSkillLevel = 'SetPlannedAllSkillLevel',
  SetSkillLevel = 'SetSkillLevel',
  SetPlannedSkillLevel = 'SetPlannedSkillLevel',
  DailyMissionFinished = 'DailyMissionFinished',
  Checkin = 'Checkin',
  OpenItemDialog = 'OpenItemDialog',
  CloseItemDialog = 'CloseItemDialog',
  OpenLootDialog = 'OpenLootDialog',
  CloseLootDialog = 'CloseLootDialog',
  SetNameFilter = 'SetNameFilter',
  SetShowNontarget = 'SetShowNontarget',
  ToggleProfessionFilter = 'ToggleProfession',
  ToggleRarityFilter = 'ToggleRarityFilter',
  WeeklyMissionFinished = 'WeeklyMissionFinished',
  ShowCompositeBonusSnackbar = 'ShowCompositeBonusSnackbar',
  HideCompositeBonusSnackbar = 'HideCompositeBonusSnackbar',
  Import = 'Import',
}

export enum Getters {
  CharacterData = 'AgentData',
  DailyMission = 'DailyMission',
  Checkin = 'Checkin',
  WeeklyMission = 'WeeklyMission',
  ExportData = 'ExportData',
}

export interface ItemChangePayload {
  item: string;
  amount: number;
}

export interface SetPromotePayload {
  characterId: string;
  targetPhase: PhaseLevel;
}

export interface SetSkillLevelPayload {
  characterId: string;
  targetAllSkillLevel: AllSkillLevel;
}

export interface SetSpecializeRankPayload {
  characterId: string;
  skillId: string;
  targetSkillLevel: SkillLevel
}

export type AllSkillLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type PhaseLevel = 0 | 1 | 2;

export interface MissionFinishedPayload {
  index: number;
  day: Moment;
}

function createSkillLevel(skills: Array<string>) {
  return skills.reduce((result: { [skillId: string]: SkillLevel }, current) => {
    result[current] = 0;
    return result;
  }, {});
}

function createCharacter(character: string): CharacterData {
  const characterDetail: CharacterDetail = Characters[character];
  const skills: Array<string> = characterDetail.skills.map((skill) => skill.skillId);
  return {
    level: 1,
    phase: 0,
    allSkillLevel: 0,
    skillLevel: createSkillLevel(skills),
    planned: {
      level: 1,
      phase: 0,
      allSkillLevel: 0,
      skillLevel: createSkillLevel(skills),
    },
  };
}

function ensureCharacterData(state: ArknightsState, character: string): CharacterData {
  if (!state.characterData[character]) {
    const characterData = createCharacter(character);
    Vue.set(state.characterData, character, characterData);
  }
  return state.characterData[character]!;
}

function ensureAllSkillLevel(level: number): AllSkillLevel {
  if (level > 6) {
    return 6;
  } else if (level < 0) {
    return 0;
  } else {
    return level as AllSkillLevel;
  }
}

function ensurePlannedAllSkillLevel(agentData: CharacterData) {
  if (agentData.planned.allSkillLevel < agentData.allSkillLevel) {
    agentData.planned.allSkillLevel = agentData.allSkillLevel;
  }
}

function ensurePhase(targetPromote: number): PhaseLevel {
  if (targetPromote > 2) {
    return 2;
  } else if (targetPromote < 0) {
    return 0;
  } else {
    return targetPromote as PhaseLevel;
  }
}

function ensurePlannedPhase(agentData: CharacterData) {
  if (agentData.planned.phase < agentData.phase) {
    agentData.planned.phase = agentData.phase;
  }
}

function ensureSkillLevel(skillLevel: number): SkillLevel {
  if (skillLevel > 3) {
    return 3;
  } else if (skillLevel < 0) {
    return 0;
  } else {
    return skillLevel as SkillLevel;
  }
}

function ensurePlannedSkillLevel(characterData: CharacterData, skillId: string) {
  if (characterData.planned.skillLevel[skillId] < characterData.skillLevel[skillId]) {
    Vue.set(characterData.planned.skillLevel, skillId, characterData.skillLevel[skillId]);
  }
}

function toDayString(day: Moment) {
  return `${day.year()}${day.month()}${day.date()}`;
}

function toWeekString(day: Moment) {
  const clonedDay = day.clone();
  return toDayString(clonedDay.weekday(1)); // monday as the first day of weekly mission
}

const options: StoreOptions<ArknightsState> = {
  state: {
    itemCounts: {},
    characterData: {},
    homeCharacterId: null,
    missions: {
      daily: {},
      weekly: {},
    },
    checkin: {},
    uiControl: {
      itemDialog: {
        shown: false,
        item: null,
      },
      lootDialog: {
        shown: false,
        stage: null,
      },
      characterFilter: {
        nameFilter: '',
        professionExcluded: {},
        rarityExcluded: [],
        showNontarget: true,
      },
      compositeBonus: {
        snackbar: false,
        items: [],
      },
    },
  },
  getters: {
    [Getters.CharacterData]: (state) => (agent: string) => {
      let characterData = state.characterData[agent];
      if (!characterData) {
        characterData = createCharacter(agent);
      }

      return characterData;
    },
    [Getters.DailyMission]: (state) => (day: Moment) => {
      return state.missions.daily[toDayString(day)] || [];
    },
    [Getters.Checkin]: (state) => (day: Moment) => {
      return state.checkin[toDayString(day)] || false;
    },
    [Getters.WeeklyMission]: (state) => (day: Moment) => {
      return state.missions.weekly[toWeekString(day)] || [];
    },
    [Getters.ExportData]: (state) => () => {
      return vuexPersist.reducer(state);
    },
  },
  mutations: {
    [Mutations.ChangeItem]: (state: ArknightsState, payload: ItemChangePayload) => {
      if (!state.itemCounts[payload.item]) {
        Vue.set(state.itemCounts, payload.item, 0);
      }
      state.itemCounts[payload.item]! += payload.amount;
      if (state.itemCounts[payload.item]! < 0) {
        state.itemCounts[payload.item] = 0;
      }
    },
    [Mutations.SetItemCount]: (state: ArknightsState, payload: ItemChangePayload) => {
      Vue.set(state.itemCounts, payload.item, payload.amount < 0 ? 0 : payload.amount);
    },
    [Mutations.SetHomeCharacter]: (state: ArknightsState, homeAgent: string) => {
      state.homeCharacterId = homeAgent;
    },
    [Mutations.SetPlannedPhase]: (state: ArknightsState, payload: SetPromotePayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      agentData.planned.phase = ensurePhase(payload.targetPhase);
      ensurePlannedPhase(agentData);
    },
    [Mutations.SetPhase]: (state: ArknightsState, payload: SetPromotePayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      agentData.phase = ensurePhase(payload.targetPhase);
      ensurePlannedPhase(agentData);
    },
    [Mutations.SetAllSkillLevel]: (state: ArknightsState, payload: SetSkillLevelPayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      agentData.allSkillLevel = ensureAllSkillLevel(payload.targetAllSkillLevel);
      ensurePlannedAllSkillLevel(agentData);
    },
    [Mutations.SetPlannedAllSkillLevel]: (state: ArknightsState, payload: SetSkillLevelPayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      agentData.planned.allSkillLevel = ensureAllSkillLevel(payload.targetAllSkillLevel);
      ensurePlannedAllSkillLevel(agentData);
    },
    [Mutations.SetSkillLevel]: (state: ArknightsState, payload: SetSpecializeRankPayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      Vue.set(agentData.skillLevel, payload.skillId, ensureSkillLevel(payload.targetSkillLevel));
      ensurePlannedSkillLevel(agentData, payload.skillId);
    },
    [Mutations.SetPlannedSkillLevel]: (state: ArknightsState, payload: SetSpecializeRankPayload) => {
      const agentData: CharacterData = ensureCharacterData(state, payload.characterId);
      Vue.set(agentData.planned.skillLevel, payload.skillId, ensureSkillLevel(payload.targetSkillLevel));
      ensurePlannedSkillLevel(agentData, payload.skillId);
    },
    [Mutations.DailyMissionFinished]: (state: ArknightsState, payload: MissionFinishedPayload) => {
      const dailyMission = state.missions.daily;
      const dayString = toDayString(payload.day);
      if (!dailyMission[dayString]) {
        Vue.set(dailyMission, dayString, []);
      }
      Vue.set(dailyMission[dayString], payload.index, true);
    },
    [Mutations.Checkin]: (state: ArknightsState, day: Moment) => {
      Vue.set(state.checkin, toDayString(day), true);
    },
    [Mutations.OpenItemDialog]: (state: ArknightsState, item: string) => {
      state.uiControl.itemDialog.shown = true;
      state.uiControl.itemDialog.item = item;
    },
    [Mutations.CloseItemDialog]: (state: ArknightsState) => {
      state.uiControl.itemDialog.shown = false;
    },
    [Mutations.OpenLootDialog]: (state: ArknightsState, stage: string) => {
      state.uiControl.lootDialog.shown = true;
      state.uiControl.lootDialog.stage = stage;
    },
    [Mutations.CloseLootDialog]: (state: ArknightsState) => {
      state.uiControl.lootDialog.shown = false;
    },
    [Mutations.SetNameFilter]: (state: ArknightsState, name: string) => {
      state.uiControl.characterFilter.nameFilter = name;
    },
    [Mutations.SetShowNontarget]: (state: ArknightsState, showNontarget: boolean) => {
      state.uiControl.characterFilter.showNontarget = showNontarget;
    },
    [Mutations.ToggleProfessionFilter]: (state: ArknightsState, profession: Profession) => {
      if (Object.values(state.uiControl.characterFilter.professionExcluded).indexOf(true) < 0) {
        AllProfessions.forEach((p) => {
          Vue.set(state.uiControl.characterFilter.professionExcluded, p, true);
        });
        Vue.set(state.uiControl.characterFilter.professionExcluded, profession, false);
      } else {
        Vue.set(state.uiControl.characterFilter.professionExcluded, profession, !state.uiControl.characterFilter.professionExcluded[profession]);
        if (Object.values(state.uiControl.characterFilter.professionExcluded).indexOf(false) < 0) {
          AllProfessions.forEach((p) => {
            Vue.set(state.uiControl.characterFilter.professionExcluded, p, false);
          });
        }
      }
    },
    [Mutations.ToggleRarityFilter]: (state: ArknightsState, rarity: number) => {
      if (state.uiControl.characterFilter.rarityExcluded.indexOf(true) < 0) {
        for (let i = 0; i < 6; i++) {
          Vue.set(state.uiControl.characterFilter.rarityExcluded, i, true);
        }
        Vue.set(state.uiControl.characterFilter.rarityExcluded, rarity, false);
      } else {
        Vue.set(state.uiControl.characterFilter.rarityExcluded, rarity, !state.uiControl.characterFilter.rarityExcluded[rarity]);
        if (state.uiControl.characterFilter.rarityExcluded.indexOf(false) < 0) {
          for (let i = 0; i < 6; i++) {
            Vue.set(state.uiControl.characterFilter.rarityExcluded, i, false);
          }
        }
      }
    },
    [Mutations.WeeklyMissionFinished]: (state: ArknightsState, payload: MissionFinishedPayload) => {
      const weeklyMission = state.missions.weekly;
      const weekString = toWeekString(payload.day);
      if (!weeklyMission[weekString]) {
        Vue.set(weeklyMission, weekString, []);
      }
      Vue.set(weeklyMission[weekString], payload.index, true);
    },
    [Mutations.ShowCompositeBonusSnackbar]: (state: ArknightsState, items: Array<string>) => {
      state.uiControl.compositeBonus.snackbar = true;
      state.uiControl.compositeBonus.items = items;
    },
    [Mutations.HideCompositeBonusSnackbar]: (state: ArknightsState) => {
      state.uiControl.compositeBonus.snackbar = false;
    },
    [Mutations.Import]: (state: ArknightsState, data: any) => {
      state.characterData = data.characterData;
      state.checkin = data.checkin;
      state.homeCharacterId = data.homeCharacterId;
      state.itemCounts = data.itemCounts;
      state.missions = data.missions;
      state.uiControl.characterFilter = data.uiControl.characterFilter;
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexPersist.plugin as Plugin<ArknightsState>],
  strict: true,
};

export default new Vuex.Store(options);
