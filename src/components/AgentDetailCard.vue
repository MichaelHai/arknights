<template>
  <v-card elevation="0">
    <v-img
      :src="require(`@/assets/agents/${agent}/background.png`)"
      class="black--text align-end"
      height="200px"
    >
      <v-card-title>{{ agent }}</v-card-title>
    </v-img>

    <v-card-text class="outerContainer">
      <v-card elevation="0">
        <v-card-title class="subtitle">精英化等级</v-card-title>
        <v-card-text>
          <item-amount-list
            v-if="getAgentDetail(agent).promoteItems.level1"
            :items="getAgentDetail(agent).promoteItems.level1"
            title="精英化1"
          />
          <item-amount-list
            v-if="getAgentDetail(agent).promoteItems.level2"
            :items="getAgentDetail(agent).promoteItems.level2"
            title="精英化2"
          />
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能等级</v-card-title>
        <v-card-text>
          <item-amount-list
            v-for="(items, index) in getAgentDetail(agent).skillLevelUpItems"
            :key="index"
            :items="items"
            :title="`${index}`"
          />
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能专精</v-card-title>
        <template v-for="(skill, index) in getAgentDetail(agent).skillSpecializeItems">
          <v-card-subtitle :key="`${skill.skillName}_title`" class="subtitle">
            <v-row>
              <v-col cols="2">
                <v-img :src="require(`@/assets/agents/${agent}/${skill.skillName}.png`)" height="24" contain/>
              </v-col>
              <v-col cols="3" class="skillTitle">
                {{ skill.skillName }}
              </v-col>
            </v-row>
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

          <v-divider :key="`${skill.skillName}_divider`"
                     v-if="index !== getAgentDetail(agent).skillSpecializeItems.length - 1"
                     class="mx-4"
          />
        </template>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Agent, AgentDetail} from '@/model';
  import MasterData from '@/assets/master-data.json';
  import ItemAmountList from '@/components/ItemAmountList.vue';

  @Component({
    components: {ItemAmountList},
  })
  export default class AgentDetailCard extends Vue {
    private agentDetail: { [agent in Agent]: AgentDetail } = MasterData.agents;
    @Prop()
    public agent!: Agent;

    protected getAgentDetail(agent: Agent): AgentDetail {
      return this.agentDetail[agent];
    }
  }
</script>

<style scoped lang="less">
  .skillLevel {
    margin: auto;
  }

  .subtitle {
    padding-bottom: 8px !important;
  }

  .outerContainer {
    padding: 0 !important;
  }

  .skillTitle {
    margin-left: -24px;
  }
</style>
