<template>
  <div>
    <v-list dense>
      <v-list-item
        v-for="agent in AllAgents"
        :key="agent"
        @click="agentClicked(agent)"
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

    <v-bottom-sheet v-model="isBottomSheetShow" scrollable="true">
      <v-card v-if="agentToShowInBottomSheet !== null">
        <v-img
          :src="require(`@/assets/agents/${agentToShowInBottomSheet}/background.png`)"
          class="black--text align-end"
          height="200px"
        >
          <v-card-title>{{ agentToShowInBottomSheet }}</v-card-title>
        </v-img>

        <v-card-text class="outerContainer">
          <v-card elevation="0">
            <v-card-title class="subtitle">精英化等级</v-card-title>
            <v-card-text>
              <item-amount-list
                v-if="getAgentDetail(agentToShowInBottomSheet).promoteItems.level1"
                :items="getAgentDetail(agentToShowInBottomSheet).promoteItems.level1"
                title="精英化1"
              />
              <item-amount-list
                v-if="getAgentDetail(agentToShowInBottomSheet).promoteItems.level2"
                :items="getAgentDetail(agentToShowInBottomSheet).promoteItems.level2"
                title="精英化2"
              />
            </v-card-text>

            <v-divider/>

            <v-card-title class="subtitle">技能等级</v-card-title>
            <v-card-text>
              <item-amount-list
                v-for="(items, index) in getAgentDetail(agentToShowInBottomSheet).skillLevelUpItems"
                :key="index"
                :items="items"
                :title="`${index}`"
              />
            </v-card-text>

            <v-divider/>

            <v-card-title class="subtitle">技能专精</v-card-title>
            <template v-for="skill in getAgentDetail(agentToShowInBottomSheet).skillSpecializeItems">
              <v-card-subtitle class="subtitle" :key="`${skill.skillName}_title`">{{ skill.skillName }}
              </v-card-subtitle>
              <v-card-text :key="skill.skillName">
                <item-amount-list
                  :items="skill.rank1"
                  title="Rank1"
                />
                <item-amount-list
                  :items="skill.rank2"
                  title="Rank2"
                />
                <item-amount-list
                  :items="skill.rank3"
                  title="Rank3"
                />
              </v-card-text>

              <v-divider inset :key="`${skill.skillName}_divider`"/>
            </template>
          </v-card>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Agent, AgentDetail, AllAgents} from '@/model';
  import MasterData from '@/assets/master-data.json';
  import {AgentData, Getters} from '@/store';
  import ItemAmountList from '@/components/ItemAmountList.vue';

  @Component({
    components: {ItemAmountList},
  })
  export default class Planner extends Vue {
    private homeAgent: Agent | null = null;
    private agentDetail: { [agent in Agent]: AgentDetail } = MasterData.agents;
    private isBottomSheetShow: boolean = false;
    private agentToShowInBottomSheet: Agent | null = null;

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

    protected agentClicked(agent: Agent): void {
      this.isBottomSheetShow = true;
      this.agentToShowInBottomSheet = agent;
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

  .subtitle {
    padding-bottom: 8px !important;
  }

  .outerContainer {
    padding: 0 !important;
  }
</style>
