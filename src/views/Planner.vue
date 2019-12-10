<template>
  <div>
    <v-list dense>
      <v-list-item
        v-for="agent in AllAgents"
        :key="agent"
      >
        <v-list-item-avatar class="avatar">
          <v-img :src="require(`@/assets/agents/${agent}/avatar.png`)"/>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-row dense>
            <v-col cols="3">
              <v-list-item-title v-text="agent"/>
              <v-list-item-subtitle v-text="getAgentDetail(agent).nameEN"/>
              <v-list-item-subtitle>
                <v-img
                  :src="require(`@/assets/meta/精英_${agentData(agent).promote}.png`)"
                  contain
                  height="13"
                  width="20"
                  class="promoteIcon"
                />
                Lv. {{ agentData(agent).level }}
              </v-list-item-subtitle>
            </v-col>
            <v-col v-if="agentData(agent).skillLevel < 7" class="skillLevel">
              技能等级: {{ agentData(agent).skillLevel }}
            </v-col>
            <v-col v-else cols="3" v-for="skillSpecializeRank in agentData(agent).skillSpecialize"
                   :key="skillSpecializeRank.skillName">
              <v-img
                :src="require(`@/assets/agents/${agent}/${skillSpecializeRank.skillName}.png`)"
                contain
                height="32"
              />
              <div class="rank">
                Rank {{ skillSpecializeRank.specializeRank }}
              </div>
            </v-col>
          </v-row>
        </v-list-item-content>

        <v-list-item-action @click="homeClicked(agent)">
          <v-icon
            v-if="agent === homeAgent"
            color="yellow"
          >
            mdi-home
          </v-icon>
          <v-icon
            v-else
            color="grey lighten-1"
          >
            mdi-home
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Agent, AgentDetail, AllAgents} from '@/model';
  import MasterData from '@/assets/master-data.json';
  import {AgentData, Getters} from '@/store';

  @Component
  export default class Planner extends Vue {
    private homeAgent: Agent | null = null;
    private agentDetail: { [agent in Agent]: AgentDetail } = MasterData.agents;

    private agentData(agent: Agent): AgentData {
      return this.$store.getters[Getters.AgentData](agent);
    }

    protected get AllAgents(): Array<Agent> {
      return AllAgents;
    }

    protected homeClicked(agent: Agent): void {
      if (agent === this.homeAgent) {
        this.homeAgent = null;
      } else {
        this.homeAgent = agent;
      }
    }

    protected getAgentDetail(agent: Agent): AgentDetail {
      return this.agentDetail[agent];
    }
  }
</script>

<style scoped lang="less">
  .avatar {
    margin-right: 8px !important;
  }

  .rank {
    text-align: center;
    font-size: 13px;
    margin-top: 4px;
  }

  .promoteIcon {
    display: inline-block;
    vertical-align: middle;
  }

  .skillLevel {
    margin: auto;
  }
</style>
