import Vue from 'vue';
import Vuex, {Plugin, StoreOptions} from 'vuex';
import VuexPersist from 'vuex-persist';
import {CharacterDetail, Characters} from '@/model';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'arknights',
  storage: window.localStorage,
});

export interface ArknightsState {
  itemCounts: { [item: string]: number };
  characterData: { [character: string]: CharacterData };
  homeCharacterId: string | null;
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
}

export enum Getters {
  CharacterData = 'AgentData',
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

const options: StoreOptions<ArknightsState> = {
  state: {
    itemCounts: {},
    characterData: {},
    homeCharacterId: null,
  },
  getters: {
    [Getters.CharacterData]: (state) => (agent: string) => {
      let characterData = state.characterData[agent];
      if (!characterData) {
        characterData = createCharacter(agent);
      }

      return characterData;
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
  },
  actions: {},
  modules: {},
  plugins: [vuexPersist.plugin as Plugin<ArknightsState>],
  strict: true,
};

export default new Vuex.Store(options);
