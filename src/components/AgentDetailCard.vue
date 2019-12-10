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
        <v-card-text class="targetPanel">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                目标练度<span><v-icon color="success" dense v-if="targetAchieved">mdi-check-circle</v-icon></span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col cols="4" offset="4">
                    <v-card elevation="0" class="alignToCenter">当前</v-card>
                  </v-col>
                  <v-col cols="4" class="alignToCenter">
                    <v-card elevation="0">目标</v-card>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="4" class="rowHeader">
                    <v-card elevation="0">精英化等级</v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-img :src="require(`@/assets/meta/精英_${agentData.promote}.png`)"
                           contain
                           height="14"
                           class="promoteIcon"
                           @click="rotateCurrentPromote"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-img :src="require(`@/assets/meta/精英_${agentData.planned.promote}.png`)"
                           contain
                           height="14"
                           class="promoteIcon"
                           @click="rotatePlannedPromote"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="4" class="rowHeader">
                    <v-card elevation="0">技能等级</v-card>
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="agentData.skillLevel"
                      @input="(value) => changeSkillLevel(value)"
                      @valueIncreased="changeSkillLevel(agentData.skillLevel + 1)"
                      @valueDecreased="changeSkillLevel(agentData.skillLevel - 1)"
                    />
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="agentData.planned.skillLevel"
                      @input="(value) => changePlannedSkillLevel(value)"
                      @valueIncreased="changePlannedSkillLevel(agentData.planned.skillLevel + 1)"
                      @valueDecreased="changePlannedSkillLevel(agentData.planned.skillLevel - 1)"
                    />
                  </v-col>
                </v-row>
                <v-row v-for="(skill, index) in agentDetail.skillSpecializeItems" :key="index" dense>
                  <v-col cols="4" class="rowHeader">
                    <v-card elevation="0">
                      <v-row dense>
                        <v-col cols="4">
                          <v-img
                            :src="require(`@/assets/agents/${agent}/${skill.skillName}.png`)"
                          />
                        </v-col>
                        <v-col cols="8" class="alignToCenter">
                          {{ skill.skillName }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="agentData.skillSpecialize[index]"
                      @input="(value) => changeSpecializeRank(index, value)"
                      @valueIncreased="changeSpecializeRank(index, agentData.skillSpecialize[index] + 1)"
                      @valueDecreased="changeSpecializeRank(index, agentData.skillSpecialize[index] - 1)"
                    />
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="agentData.planned.skillSpecialize[index]"
                      @input="(value) => changePlannedSpecializeRank(index, value)"
                      @valueIncreased="changePlannedSpecializeRank(index, agentData.planned.skillSpecialize[index] + 1)"
                      @valueDecreased="changePlannedSpecializeRank(index, agentData.planned.skillSpecialize[index] - 1)"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">精英化等级</v-card-title>
        <v-card-text>
          <item-amount-list
            v-if="agentDetail.promoteItems.level1 && agentData.promote < 1"
            :items="agentDetail.promoteItems.level1"
            title="精英化1"
            :class="{'white--text': agentData.planned.promote >= 1}"
          />
          <item-amount-list
            v-if="agentDetail.promoteItems.level2 && agentData.promote < 2"
            :items="agentDetail.promoteItems.level2"
            title="精英化2"
            :class="{'white--text': agentData.planned.promote >= 2}"
          />
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能等级</v-card-title>
        <v-card-text>
          <template v-for="(items, index) in agentDetail.skillLevelUpItems">
            <item-amount-list
              v-if="`level${agentData.skillLevel}` < index"
              :key="index"
              :items="items"
              :title="`${index}`"
              :class="{'white--text': `level${agentData.planned.skillLevel}` >= index}"
            />
          </template>
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能专精</v-card-title>
        <template v-for="(skill, index) in agentDetail.skillSpecializeItems">
          <template v-if="agentData.skillSpecialize[index] !== 3">
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
                v-if="agentData.skillSpecialize[index] < 1"
                :items="skill.rank1"
                title="Rank1"
                :class="{'white--text': agentData.planned.skillSpecialize[index] >= 1}"
              />
              <item-amount-list
                v-if="agentData.skillSpecialize[index] < 2"
                :items="skill.rank2"
                title="Rank2"
                :class="{'white--text': agentData.planned.skillSpecialize[index] >= 2}"
              />
              <item-amount-list
                v-if="agentData.skillSpecialize[index] < 3"
                :items="skill.rank3"
                title="Rank3"
                :class="{'white--text': agentData.planned.skillSpecialize[index] >= 3}"
              />
            </v-card-text>

            <v-divider :key="`${skill.skillName}_divider`"
                       v-if="index !== agentDetail.skillSpecializeItems.length - 1"
                       class="mx-4"
            />
          </template>
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
  import {AgentData, Getters, Mutations} from '@/store';
  import NumberInput from '@/components/NumberInput.vue';
  import {targetAchieved} from '@/model/Utils';

  @Component({
    components: {NumberInput, ItemAmountList},
  })
  export default class AgentDetailCard extends Vue {
    private agentDetails: { [agent in Agent]: AgentDetail } = MasterData.agents;
    @Prop()
    public agent!: Agent;

    protected get agentDetail(): AgentDetail {
      return this.agentDetails[this.agent];
    }

    private get agentData(): AgentData {
      return this.$store.getters[Getters.AgentData](this.agent);
    }

    protected get targetAchieved(): boolean {
      return targetAchieved(this.agentData);
    }

    protected rotatePlannedPromote() {
      const currentPlannedPromote = this.agentData.planned.promote;
      this.$store.commit(Mutations.SetPlannedPromote, {
        agent: this.agent,
        targetPromote: (currentPlannedPromote + 1) % 3,
      });
    }

    protected rotateCurrentPromote() {
      const currentPromote = this.agentData.promote;
      this.$store.commit(Mutations.SetPromote, {
        agent: this.agent,
        targetPromote: (currentPromote + 1) % 3,
      });
    }

    protected changeSkillLevel(targetSkillLevel: number) {
      this.$store.commit(Mutations.SetSkillLevel, {
        agent: this.agent,
        targetSkillLevel,
      });
    }

    protected changePlannedSkillLevel(targetSkillLevel: number) {
      this.$store.commit(Mutations.SetPlannedSkillLevel, {
        agent: this.agent,
        targetSkillLevel,
      });
    }

    protected changeSpecializeRank(index: number, targetSpecializeRank: number) {
      this.$store.commit(Mutations.SetSpecializeRank, {
        agent: this.agent,
        index: index,
        targetSpecializeRank,
      });
    }

    protected changePlannedSpecializeRank(index: number, targetSpecializeRank: number) {
      this.$store.commit(Mutations.SetPlannedSpecializeRank, {
        agent: this.agent,
        index: index,
        targetSpecializeRank,
      });
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

  .promoteIcon {
    display: inline-block;
    vertical-align: middle;
  }

  .alignToCenter {
    text-align: center;
  }

  .rowHeader {
    margin: auto;
  }

  .targetPanel {
    padding: 0;
  }
</style>
