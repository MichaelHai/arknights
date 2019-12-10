import Vue from 'vue';
import Vuex, {Plugin, StoreOptions} from 'vuex';
import VuexPersist from 'vuex-persist';
import {Agent, AgentDetail, Item} from '@/model';
import MasterData from '@/assets/master-data.json';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'arknights',
  storage: window.localStorage,
});

export interface ArknightsState {
  itemCounts: { [item in Item]?: number };
  agentData: { [agent in Agent]?: AgentData };
  homeAgent: Agent | null;
}

export interface AgentData {
  level: number;
  promote: PromoteLevel;
  skillLevel: SkillLevel;
  skillSpecialize: Array<SkillSpecializeRank>;
  planned: {
    level: number;
    promote: PromoteLevel;
    skillLevel: SkillLevel;
    skillSpecialize: Array<SkillSpecializeRank>;
  }
}

export type SkillSpecializeRank = 0 | 1 | 2 | 3;

export enum Mutations {
  ChangeItem = 'ChangeItem',
  SetItemCount = 'SetItemCount',
  SetHomeAgent = 'SetHomeAgent',
  SetPlannedPromote = 'SetPlannedPromote',
  SetPromote = 'SetPromote',
  SetSkillLevel = 'SetSkillLevel',
  SetPlannedSkillLevel = 'SetPlannedSkillLevel',
  SetSpecializeRank = 'SetSpecializeRank',
  SetPlannedSpecializeRank = 'SetPlannedSpecializeRank',
}

export enum Getters {
  AgentData = 'AgentData',
}

export interface ItemChangePayload {
  item: Item;
  amount: number;
}

export interface SetPromotePayload {
  agent: Agent;
  targetPromote: PromoteLevel;
}

export interface SetSkillLevelPayload {
  agent: Agent;
  targetSkillLevel: SkillLevel;
}

export interface SetSpecializeRankPayload {
  agent: Agent;
  index: number;
  targetSpecializeRank: SkillSpecializeRank
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PromoteLevel = 0 | 1 | 2;

function createAgentData(agent: Agent): AgentData {
  const agents: { [agent in Agent]: AgentDetail } = MasterData.agents;
  const agentMasterData: AgentDetail = agents[agent];
  const skillSpecialize: Array<SkillSpecializeRank> = agentMasterData.skillSpecializeItems
    .map(() => 0 as SkillSpecializeRank);
  return {
    level: 1,
    promote: 0,
    skillLevel: 1,
    skillSpecialize,
    planned: {
      level: 1,
      promote: 0,
      skillLevel: 1,
      skillSpecialize: Array(...skillSpecialize),
    },
  };
}

function ensureAgentData(state: ArknightsState, agent: Agent): AgentData {
  if (!state.agentData[agent]) {
    const agentData = createAgentData(agent);
    Vue.set(state.agentData, agent, agentData);
  }
  return state.agentData[agent]!;
}

function ensureSkillLevel(level: number): SkillLevel {
  if (level > 7) {
    return 7;
  } else if (level < 1) {
    return 1;
  } else {
    return level as SkillLevel;
  }
}

function ensurePlannedSkillLevel(agentData: AgentData) {
  if (agentData.planned.skillLevel < agentData.skillLevel) {
    agentData.planned.skillLevel = agentData.skillLevel;
  }
}

function ensurePromoteLevel(targetPromote: number): PromoteLevel {
  if (targetPromote > 2) {
    return 2;
  } else if (targetPromote < 0) {
    return 0;
  } else {
    return targetPromote as PromoteLevel;
  }
}

function ensurePlannedPromote(agentData: AgentData) {
  if (agentData.planned.promote < agentData.promote) {
    agentData.planned.promote = agentData.promote;
  }
}

function ensureSkillSpecializeRank(targetSpecializeRank: number): SkillSpecializeRank {
  if (targetSpecializeRank > 3) {
    return 3;
  } else if (targetSpecializeRank < 0) {
    return 0;
  } else {
    return targetSpecializeRank as SkillSpecializeRank;
  }
}

function ensurePlannedSkillSpecializeRank(agentData: AgentData, index: number) {
  if (agentData.planned.skillSpecialize[index] < agentData.skillSpecialize[index]) {
    Vue.set(agentData.planned.skillSpecialize, index, agentData.skillSpecialize[index]);
  }
}

const options: StoreOptions<ArknightsState> = {
  state: {
    itemCounts: {},
    agentData: {},
    homeAgent: null,
  },
  getters: {
    [Getters.AgentData]: (state) => (agent: Agent) => {
      let agentData = state.agentData[agent];
      if (!agentData) {
        agentData = createAgentData(agent);
      }

      return agentData;
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
    [Mutations.SetHomeAgent]: (state: ArknightsState, homeAgent: Agent) => {
      state.homeAgent = homeAgent;
    },
    [Mutations.SetPlannedPromote]: (state: ArknightsState, payload: SetPromotePayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      agentData.planned.promote = ensurePromoteLevel(payload.targetPromote);
      ensurePlannedPromote(agentData);
    },
    [Mutations.SetPromote]: (state: ArknightsState, payload: SetPromotePayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      agentData.promote = ensurePromoteLevel(payload.targetPromote);
      ensurePlannedPromote(agentData);
    },
    [Mutations.SetSkillLevel]: (state: ArknightsState, payload: SetSkillLevelPayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      agentData.skillLevel = ensureSkillLevel(payload.targetSkillLevel);
      ensurePlannedSkillLevel(agentData);
    },
    [Mutations.SetPlannedSkillLevel]: (state: ArknightsState, payload: SetSkillLevelPayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      agentData.planned.skillLevel = ensureSkillLevel(payload.targetSkillLevel);
      ensurePlannedSkillLevel(agentData);
    },
    [Mutations.SetSpecializeRank]: (state: ArknightsState, payload: SetSpecializeRankPayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      Vue.set(agentData.skillSpecialize, payload.index, ensureSkillSpecializeRank(payload.targetSpecializeRank));
      ensurePlannedSkillSpecializeRank(agentData, payload.index);
    },
    [Mutations.SetPlannedSpecializeRank]: (state: ArknightsState, payload: SetSpecializeRankPayload) => {
      const agentData: AgentData = ensureAgentData(state, payload.agent);
      Vue.set(agentData.planned.skillSpecialize, payload.index, ensureSkillSpecializeRank(payload.targetSpecializeRank));
      ensurePlannedSkillSpecializeRank(agentData, payload.index);
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexPersist.plugin as Plugin<ArknightsState>],
  strict: true,
};

export default new Vuex.Store(options);
