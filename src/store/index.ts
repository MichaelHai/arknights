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
  promote: 0 | 1 | 2;
  skillLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  skillSpecialize: Array<SkillSpecializeRank>
}

export interface SkillSpecializeRank {
  skillName: string;
  specializeRank: 0 | 1 | 2 | 3;
}

export enum Mutations {
  ChangeItem = 'ChangeItem',
  SetItemCount = 'SetItemCount',
  SetAgentData = 'SetAgentData',
  SetHomeAgent = 'SetHomeAgent',
}

export enum Getters {
  AgentData = 'AgentData',
}

export interface ItemChangePayload {
  item: Item;
  amount: number;
}

export interface SetAgentPayload {
  agent: Agent;
  agentData: AgentData;
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
        const agents: { [agent in Agent]: AgentDetail } = MasterData.agents;
        const agentMasterData: AgentDetail = agents[agent];
        const skillSpecialize: Array<SkillSpecializeRank> =
          agentMasterData.skillSpecializeItems
            .map((skillSpecializeItem) => skillSpecializeItem.skillName)
            .map((skillName: string) => {
              return {
                skillName,
                specializeRank: 0,
              };
            });
        agentData = {
          level: 1,
          promote: 0,
          skillLevel: 1,
          skillSpecialize,
        };
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
    [Mutations.SetAgentData]: (state: ArknightsState, payload: SetAgentPayload) => {
      Vue.set(state.agentData, payload.agent, payload.agentData);
    },
    [Mutations.SetHomeAgent]: (state: ArknightsState, homeAgent: Agent) => {
      state.homeAgent = homeAgent;
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexPersist.plugin as Plugin<ArknightsState>],
  strict: true,
};

export default new Vuex.Store(options);
