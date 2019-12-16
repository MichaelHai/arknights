<template>
  <v-card elevation="0">
    <v-img
      :src="characterBackground(characterId)"
      class="black--text align-end"
      height="200px"
    >
      <v-card-title>{{ character.name }}</v-card-title>
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
                    <v-img :src="phaseIcon(characterData.phase)"
                           contain
                           height="14"
                           class="phaseIcon"
                           @click="rotateCurrentPhase"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-img :src="phaseIcon(characterData.planned.phase)"
                           contain
                           height="14"
                           class="phaseIcon"
                           @click="rotatePlannedPhase"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="4" class="rowHeader">
                    <v-card elevation="0">技能等级</v-card>
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="characterData.allSkillLevel + 1"
                      @input="(value) => changeAllSkillLevel(value - 1)"
                      @valueIncreased="changeAllSkillLevel(characterData.allSkillLevel + 1)"
                      @valueDecreased="changeAllSkillLevel(characterData.allSkillLevel - 1)"
                    />
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="characterData.planned.allSkillLevel + 1"
                      @input="(value) => changePlannedAllSkillLevel(value - 1)"
                      @valueIncreased="changePlannedAllSkillLevel(characterData.planned.allSkillLevel + 1)"
                      @valueDecreased="changePlannedAllSkillLevel(characterData.planned.allSkillLevel - 1)"
                    />
                  </v-col>
                </v-row>
                <v-row v-for="skill in character.skills" :key="skill.skillId" dense>
                  <v-col cols="4" class="rowHeader">
                    <v-card elevation="0">
                      <v-row dense>
                        <v-col cols="4">
                          <v-img
                            :src="skillIcon(skill.skillId)"
                          />
                        </v-col>
                        <v-col cols="8" class="alignToCenter">
                          {{ skillName(skill.skillId, characterData) }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="characterData.skillLevel[skill.skillId]"
                      @input="(value) => changeSkillLevel(skill.skillId, value)"
                      @valueIncreased="changeSkillLevel(skill.skillId, characterData.skillLevel[skill.skillId] + 1)"
                      @valueDecreased="changeSkillLevel(skill.skillId, characterData.skillLevel[skill.skillId] - 1)"
                    />
                  </v-col>
                  <v-col cols="4">
                    <number-input
                      :value="characterData.planned.skillLevel[skill.skillId]"
                      @input="(value) => changePlannedSpecializeRank(skill.skillId, value)"
                      @valueIncreased="changePlannedSpecializeRank(skill.skillId, characterData.planned.skillLevel[skill.skillId] + 1)"
                      @valueDecreased="changePlannedSpecializeRank(skill.skillId, characterData.planned.skillLevel[skill.skillId] - 1)"
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
          <template v-for="(phase, index) in character.phases">
            <item-amount-list
              v-if="phase.evolveCost != null && characterData.phase < index"
              :key="`${characterId}_phase${index}`"
              :items="phase.evolveCost"
              :levelUp="promoteLevelUp(index)"
              :title="`精英化${index}`"
              :class="{'white--text': characterData.planned.phase >= index}"
            />
          </template>
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能等级</v-card-title>
        <v-card-text>
          <template v-for="(levelUpCostCond, index) in character.allSkillLvlup">
            <item-amount-list
              v-if="characterData.allSkillLevel < (index + 1)"
              :key="`skill_level_to_${index + 2}`"
              :items="levelUpCostCond.lvlUpCost"
              :title="`Level ${index + 2}`"
              :levelUp="skillLevelUp(index + 1)"
              :class="{'white--text': characterData.planned.allSkillLevel >= (index + 1)}"
            />
          </template>
        </v-card-text>

        <v-divider/>

        <v-card-title class="subtitle">技能专精</v-card-title>
        <template v-for="(skill, index) in character.skills">
          <template v-if="characterData.skillLevel[skill.skillId] !== 3">
            <v-card-subtitle :key="`${skill.skillId}_title`" class="subtitle">
              <v-row>
                <v-col cols="2">
                  <v-img :src="skillIcon(skill.skillId)" height="24" contain/>
                </v-col>
                <v-col cols="3" class="skillTitle">
                  {{ skillName(skill.skillId, characterData) }}
                </v-col>
              </v-row>
            </v-card-subtitle>

            <v-card-text :key="skill.skillId">
              <template v-for="(levelUpCostCond, rankIndex) in skill.levelUpCostCond">
                <item-amount-list
                  :key="`skill_${skill.skillId}_rank_${rankIndex + 1}`"
                  v-if="characterData.skillLevel[skill.skillId] <= rankIndex"
                  :items="levelUpCostCond.levelUpCost"
                  :levelUp="specializeLevelUp(skill.skillId, rankIndex + 1)"
                  :title="`Rank ${rankIndex+1}`"
                  :class="{'white--text': characterData.planned.skillLevel[skill.skillId] > rankIndex}"
                />
              </template>
            </v-card-text>

            <v-divider :key="`${skill.skillId}_divider`"
                       v-if="index !== character.skills.length - 1"
                       class="mx-4"
            />
          </template>
        </template>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Prop} from 'vue-property-decorator';
  import {CharacterDetail, Characters, LevelUp, LevelUpType} from '@/model';
  import ItemAmountList from '@/components/ItemAmountList.vue';
  import {AllSkillLevel, CharacterData, Getters, Mutations, PhaseLevel, SkillLevel} from '@/store';
  import NumberInput from '@/components/NumberInput.vue';
  import {targetAchieved} from '@/model/Utils';
  import {mixins} from 'vue-class-component';
  import ImageHelper from '@/components/mixins/ImageHelper';
  import SkillSupport from '@/components/mixins/SkillSupport';

  @Component({
    components: {NumberInput, ItemAmountList},
  })
  export default class CharacterDetailCard extends mixins(ImageHelper, SkillSupport) {
    @Prop()
    public characterId!: string;

    protected get character(): CharacterDetail {
      return Characters[this.characterId];
    }

    private get characterData(): CharacterData {
      return this.$store.getters[Getters.CharacterData](this.characterId);
    }

    protected get targetAchieved(): boolean {
      return targetAchieved(this.characterData);
    }

    protected rotatePlannedPhase() {
      const currentPlannedPhase = this.characterData.planned.phase;
      this.$store.commit(Mutations.SetPlannedPhase, {
        characterId: this.characterId,
        targetPhase: (currentPlannedPhase + 1) % 3,
      });
    }

    protected rotateCurrentPhase() {
      const currentPhase = this.characterData.phase;
      this.$store.commit(Mutations.SetPhase, {
        characterId: this.characterId,
        targetPhase: (currentPhase + 1) % 3,
      });
    }

    protected changeAllSkillLevel(targetAllSkillLevel: number) {
      this.$store.commit(Mutations.SetAllSkillLevel, {
        characterId: this.characterId,
        targetAllSkillLevel,
      });
    }

    protected changePlannedAllSkillLevel(targetAllSkillLevel: number) {
      this.$store.commit(Mutations.SetPlannedAllSkillLevel, {
        characterId: this.characterId,
        targetAllSkillLevel,
      });
    }

    protected changeSkillLevel(skillId: string, targetSkillLevel: number) {
      this.$store.commit(Mutations.SetSkillLevel, {
        characterId: this.characterId,
        skillId,
        targetSkillLevel,
      });
    }

    protected changePlannedSpecializeRank(skillId: string, targetSkillLevel: number) {
      this.$store.commit(Mutations.SetPlannedSkillLevel, {
        characterId: this.characterId,
        skillId,
        targetSkillLevel,
      });
    }

    private promoteLevelUp(to: PhaseLevel): LevelUp {
      return {
        type: LevelUpType.PROMOTE,
        promoteTo: to as PhaseLevel,
        characterId: this.characterId,
      };
    }

    private skillLevelUp(to: number): LevelUp {
      return {
        type: LevelUpType.SKILL,
        skillUpTo: to as AllSkillLevel,
        characterId: this.characterId,
      };
    }

    private specializeLevelUp(skillId: string, to: SkillLevel): LevelUp {
      return {
        type: LevelUpType.SPECIALIZE,
        specializeTarget: {
          specializeSkill: skillId,
          specializeRankTo: to,
        },
        characterId: this.characterId,
      };
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

  .phaseIcon {
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
