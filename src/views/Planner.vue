<template>
  <div>
    <v-dialog scrollable v-model="filterDialog">
      <v-card>
        <v-card-title>干员筛选</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3" class="my-auto">代号</v-col>
            <v-col cols="9">
              <v-text-field
                v-model="nameFilter"
                prepend-inner-icon="mdi-account-search"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="my-auto ">职业</v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="3" v-for="profession in AllProfessions" :key="profession">
                  <v-btn :outlined="professionExcluded[profession]" @click="professionClicked(profession)" small>
                    {{ ProfessionName[profession] }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="my-auto">稀有度</v-col>
            <v-col>
              <v-row>
                <v-col cols="3" v-for="rarity in 6" :key="rarity">
                  <v-btn :outlined="rarityExcluded[rarity - 1]" @click="rarityClicked(rarity - 1)" small>
                    {{ rarity }}星
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="my-auto">非目标</v-col>
            <v-col>
              <v-switch v-model="showNontarget"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      fab
      color="red"
      bottom
      right
      fixed
      @click.prevent="filterDialog = true"
      class="filterButton"
    >
      <v-icon>mdi-filter</v-icon>
    </v-btn>

    <v-list dense>
      <v-list-item
        v-for="characterId in characters"
        :key="characterId"
        @click="characterClicked(characterId)"
      >
        <v-list-item-avatar class="avatar" tile>
          <v-img :src="characterAvatar(characterId)">
            <v-icon class="avatarCheck" color="success" v-if="targetAchieved(characterId)">mdi-check-circle</v-icon>
          </v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-row dense>
            <v-col cols="3">
              <v-list-item-title v-text="characterDetail(characterId).name"></v-list-item-title>
              <v-list-item-subtitle v-text="characterDetail(characterId).appellation"/>
              <v-list-item-subtitle>
                {{ characterDetail(characterId).rarity + 1 }}星
                <v-img
                  :src="phaseIcon(characterData(characterId).phase)"
                  contain
                  height="13"
                  width="20"
                  class="phaseIcon"
                />
              </v-list-item-subtitle>
            </v-col>
            <v-col v-if="characterData(characterId).allSkillLevel < 6" class="skillLevel">
              技能等级: {{ characterData(characterId).allSkillLevel + 1 }}
            </v-col>
            <v-col v-else cols="3" v-for="(skillLevel, skillId) in characterData(characterId).skillLevel"
                   :key="`${characterId}_skill_${skillId}`">
              <v-img
                :src="skillIcon(skillId)"
                contain
                height="32"
              />
              <div class="rank">
                Rank {{ skillLevel }}
              </div>
            </v-col>
          </v-row>
        </v-list-item-content>

        <v-list-item-action @click.prevent.stop="homeClicked(characterId)">
          <v-icon
            v-if="characterId === homeCharacterId"
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

    <v-bottom-sheet v-model="isBottomSheetShow" :scrollable="true">
      <character-detail-card :characterId="characterShownInBottomSheet"/>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {CharacterDetail, Characters, Profession, AllProfessions} from '@/model';
  import {CharacterData, Getters, Mutations} from '@/store';
  import CharacterDetailCard from '@/components/CharacterDetailCard.vue';
  import {mixins} from 'vue-class-component';
  import ImageHelper from '@/components/mixins/ImageHelper';
  import {targetAchieved} from '@/model/Utils';

  @Component({
    components: {CharacterDetailCard},
  })
  export default class Planner extends mixins(ImageHelper) {
    private isBottomSheetShow: boolean = false;
    private characterShownInBottomSheet: string | null = null;

    private filterDialog: boolean = false;

    private ProfessionName: { [profession: string]: string } = {
      PIONEER: '先锋',
      SNIPER: '狙击',
      MEDIC: '医疗',
      CASTER: '术师',
      WARRIOR: '近卫',
      TANK: '重装',
      SUPPORT: '辅助',
      SPECIAL: '特种',
    };

    private get AllProfessions(): Array<Profession> {
      return AllProfessions;
    }

    private get nameFilter(): string {
      return this.$store.state.uiControl.characterFilter.nameFilter;
    }

    private set nameFilter(name: string) {
      this.$store.commit(Mutations.SetNameFilter, name);
    }

    private get professionExcluded(): { [profession: string]: boolean } {
      return this.$store.state.uiControl.characterFilter.professionExcluded;
    }

    private get rarityExcluded(): Array<boolean> {
      return this.$store.state.uiControl.characterFilter.rarityExcluded;
    }

    private get showNontarget(): boolean {
      return this.$store.state.uiControl.characterFilter.showNontarget;
    }

    private set showNontarget(value: boolean) {
      this.$store.commit(Mutations.SetShowNontarget, value);
    }

    private characterData(characterId: string): CharacterData {
      return this.$store.getters[Getters.CharacterData](characterId);
    }

    protected targetAchieved(characterId: string): boolean {
      return targetAchieved(this.characterData(characterId));
    }

    protected get characters(): Array<string> {
      return Object.keys(Characters)
        .filter((c) => Characters[c].profession !== Profession.TOKEN)
        .filter((c) => Characters[c].profession !== Profession.TRAP)
        .filter((c) => !this.professionExcluded[Characters[c].profession])
        .filter((c) => !this.rarityExcluded[Characters[c].rarity])
        .filter((c) => Characters[c].name.includes(this.nameFilter) || Characters[c].appellation.includes(this.nameFilter))
        .filter((c) => this.showNontarget || !this.targetAchieved(c))
        .sort((c1, c2) => {
          if (this.targetAchieved(c1) && !this.targetAchieved(c2)) {
            return 1;
          } else if (!this.targetAchieved(c1) && this.targetAchieved(c2)) {
            return -1;
          } else {
            return Characters[c2].rarity - Characters[c1].rarity;
          }
        });
    }

    protected homeClicked(characterId: string): void {
      if (characterId === this.homeCharacterId) {
        this.homeCharacterId = null;
      } else {
        this.homeCharacterId = characterId;
      }
    }

    private set homeCharacterId(characterId: string | null) {
      this.$store.commit(Mutations.SetHomeCharacter, characterId);
    }

    private get homeCharacterId(): string | null {
      return this.$store.state.homeCharacterId;
    }

    protected characterClicked(character: string): void {
      this.isBottomSheetShow = true;
      this.characterShownInBottomSheet = character;
    }

    private characterDetail(characterId: string): CharacterDetail {
      return Characters[characterId];
    }

    private professionClicked(profession: Profession) {
      this.$store.commit(Mutations.ToggleProfessionFilter, profession);
    }

    private rarityClicked(rarity: number) {
      this.$store.commit(Mutations.ToggleRarityFilter, rarity);
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

  .phaseIcon {
    display: inline-block;
    vertical-align: middle;
  }

  .avatarCheck {
    font-size: 16px;
    margin-top: 12px;
    margin-left: 20px;
  }

  .filterButton {
    margin-bottom: 56px;
  }
</style>
