<template>
  <div>
    <v-row dense @click.stop="showDialog = true">
      <v-col cols="3" class="ma-auto">{{ title }}</v-col>
      <v-col cols="9">
        <v-row dense>
          <template v-for="item in items">
            <v-col cols="6" :key="item.id">
              <item-requirement :item="item"/>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" scrollable fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dense absolute width="100%">
          <v-btn icon @click="showDialog = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn text @click="doLevelUp">完成</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pa-0 pt-12">
          <v-card elevation="0">
            <v-card-subtitle>需求一览</v-card-subtitle>
            <v-card-text>
              <v-row dense>
                <v-col cols="4" v-for="item in items" :key="`dialog_${item.id}`">
                  <item-requirement :item="item"/>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider/>

            <v-card-subtitle>建议刷图</v-card-subtitle>

            <v-card-text>
              <v-list dense>
                <v-list-item dense class="pa-0">
                  <v-list-item-content>
                    <v-row dense>
                      <template v-for="item in mapItems">
                        <v-col cols="2" :key="`shortage_icon_${item.id}`">
                          <item-avatar
                            :item="item.id"
                            :text="`× ${item.count}`"
                          />
                        </v-col>
                        <v-col cols="4" :key="`shortage_map_${item.id}`" class="ma-auto">
                          <v-row dense>
                            <v-btn
                              v-for="stage in getItemSuggestion(item.id)"
                              :key="`btn_${stage}`"
                              @click.stop="mapClicked(stage)"
                              small
                              tile
                              class="ma-1"
                            >
                              {{ getStageDetail(stage).code }}
                            </v-btn>
                          </v-row>
                        </v-col>
                      </template>
                      <v-col cols="6" v-if="mapItems.length % 2 === 1"/>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider/>

            <v-card-subtitle>建议合成</v-card-subtitle>
            <v-card-text>
              <v-list dense>
                <v-list-item v-for="item in compositeItems" :key="`shortage_${item.id}`" dense class="pa-0">
                  <v-list-item-content>
                    <v-row dense justify="center">
                      <v-col cols="2">
                        <item-avatar
                          :item="item.id"
                          :text="`× ${item.count}`"
                        />
                      </v-col>
                      <v-col cols="1" class="ma-auto">
                        <span>=</span>
                      </v-col>
                      <v-col
                        v-for="compositeItem in getCompositeItems(item.id)"
                        :key="`composite_${item.id}_${compositeItem.id}`"
                        cols="2"
                      >
                        <item-avatar
                          :class="compositeClass(compositeItem, item.count)"
                          :item="compositeItem.id"
                          :text="`${compositeItem.count} / ${ getItemAmountInWarehouse(compositeItem.id) }`"
                        />
                      </v-col>
                      <v-spacer/>
                      <v-col cols="3" class="text-end">
                        <v-btn small tile class="ma-1" @click="compositeOne(item.id)">合成</v-btn>
                        <v-btn small tile class="ma-1" @click="composite(item)"> 全部</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
        <v-snackbar v-model="compositeSnackbar" :timeout="3000">
          材料已合成!
          <v-btn @click.prevent="compositeBonusDialog = true" small text color="success">额外掉落</v-btn>
        </v-snackbar>
      </v-card>
    </v-dialog>
    <loot-dialog
      v-if="lootDialogStage !== null"
      :stage="lootDialogStage"
      v-model="lootDialog"
    />
    <v-dialog
      v-model="compositeBonusDialog"
      scrollable
    >
      <v-card>
        <v-card-title>副产品</v-card-title>
        <v-card-text>
          <warehouse-list :items="compositeBonusItems"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import {CostItem, LevelUp, LevelUpType} from '@/model';
  import ItemRequirement from '@/components/ItemRequirement.vue';
  import LootDialog from '@/components/LootDialog.vue';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import {CharacterData, Getters, Mutations} from '@/store';
  import ItemSupport from '@/components/mixins/ItemSupport';
  import {mixins} from 'vue-class-component';
  import StageSupport from '@/components/mixins/StageSupport';
  import SkillSupport from '@/components/mixins/SkillSupport';
  import WarehouseList from '@/components/WarehouseList.vue';

  @Component({
    components: {WarehouseList, ItemAvatar, LootDialog, ItemRequirement},
  })
  export default class ItemAmountList extends mixins(ItemSupport, StageSupport, SkillSupport) {
    @Prop()
    public items!: Array<CostItem>;
    @Prop()
    public title!: string;
    @Prop()
    public levelUp!: LevelUp;

    private showDialog: boolean = false;
    private mapItems: Array<CostItem> = [];
    private compositeItems: Array<CostItem> = [];
    private compositeSnackbar: boolean = false;
    private compositeBonusDialog: boolean = false;
    private compositeBonusItems: Array<string> = [];
    private snackbar: boolean = false;
    private snackbarMessage: string = '';
    private lootDialog: boolean = false;
    private lootDialogStage: string | null = null;

    private get warehouseItemCounts(): { [item: string]: number } {
      return this.$store.state.itemCounts;
    }

    @Watch('showDialog')
    private showDialogChanged() {
      if (this.showDialog) {
        this.calculateSuggestion();
      } else {
        this.mapItems = [];
        this.compositeItems = [];
      }
    }

    private calculateSuggestion() {
      this.mapItems = [];
      this.compositeItems = [];
      const unprocessedItems: Array<CostItem> = [...this.items];
      const mapItemsMap = new Map<string, number>();
      const compositeItemsMap = new Map<string, number>();
      while (unprocessedItems.length !== 0) {
        const item = unprocessedItems.pop()!;
        const itemId = item.id;
        if (this.getItemSuggestion(itemId) !== 'composite') {
          this.addToMap(item, mapItemsMap);
        } else {
          const countAdded = this.addToMap(item, compositeItemsMap);
          const compositeItems: Array<CostItem> = this.getCompositeItems(itemId);
          for (let i = 0; i < countAdded; i++) {
            unprocessedItems.push(...compositeItems);
          }
        }
      }

      this.addToList(mapItemsMap, this.mapItems);
      this.addToList(compositeItemsMap, this.compositeItems);
    }

    private addToList(map: Map<string, number>, list: Array<CostItem>) {
      map.forEach((count, id) => {
        if (count > 0) {
          list.push({
            id,
            count,
          });
        }
      });
    }

    private addToMap(item: CostItem, mapItemsMap: Map<string, number>): number {
      const itemId = item.id;
      let count = item.count;
      let countAdded = 0;
      if (!mapItemsMap.has(itemId)) {
        mapItemsMap.set(itemId, -this.getItemAmountInWarehouse(itemId));
      }

      const countBefore = mapItemsMap.get(itemId)!;
      count += countBefore;
      if (count <= 0) {
        countAdded = 0;
      } else if (countBefore < 0) {
        countAdded = count;
      } else {
        countAdded = count - countBefore;
      }
      mapItemsMap.set(itemId, count);
      return countAdded;
    }

    private mapClicked(map: string) {
      this.lootDialog = true;
      this.lootDialogStage = map;
    }

    @Watch('lootDialog')
    private lootDialogChanged() {
      if (!this.lootDialog) {
        this.calculateSuggestion();
      }
    }

    @Watch('compositeBonusDialog')
    private compositeBonusDialogChanged() {
      if (!this.compositeBonusDialog) {
        this.calculateSuggestion();
      }
    }

    private doLevelUp() {
      const check: boolean | string = this.checkLevelUp();
      if (check === true) {
        this.showDialog = false;
        this.items.forEach((item) => {
          this.$store.commit(Mutations.ChangeItem, {
            item: item.id,
            amount: -item.count,
          });
        });
        switch (this.levelUp.type) {
          case LevelUpType.PROMOTE:
            this.$store.commit(Mutations.SetPhase, {
              characterId: this.levelUp.characterId,
              targetPhase: this.levelUp.promoteTo,
            });
            break;
          case LevelUpType.SKILL:
            this.$store.commit(Mutations.SetAllSkillLevel, {
              characterId: this.levelUp.characterId,
              targetAllSkillLevel: this.levelUp.skillUpTo,
            });
            break;
          case LevelUpType.SPECIALIZE:
            this.$store.commit(Mutations.SetSkillLevel, {
              characterId: this.levelUp.characterId,
              skillId: this.levelUp.specializeTarget!.specializeSkill,
              targetSkillLevel: this.levelUp.specializeTarget!.specializeRankTo,
            });
        }
      } else {
        this.snackbarMessage = String(check);
        this.snackbar = true;
      }
    }

    private checkLevelUp(): boolean | string {
      const result: boolean | string = this.checkPrecondition();
      if (result !== true) {
        return result;
      } else {
        return this.checkItems();
      }
    }

    private checkItems(): boolean | string {
      const anyItemNotEnough = this.items.filter((item) => item.count > this.getItemAmountInWarehouse(item.id)).length > 0;
      if (anyItemNotEnough) {
        return '材料不足';
      } else {
        return true;
      }
    }

    private checkPrecondition(): boolean | string {
      const characterData: CharacterData = this.$store.getters[Getters.CharacterData](this.levelUp.characterId);
      switch (this.levelUp.type) {
        case LevelUpType.PROMOTE:
          if (this.levelUp.promoteTo === (characterData.phase + 1)) {
            return true;
          } else {
            return `请先升至精英化${this.levelUp.promoteTo! - 1}`;
          }
        case LevelUpType.SKILL:
          if (this.levelUp.skillUpTo === (characterData.allSkillLevel + 1)) {
            return true;
          } else {
            return `请先将技能升级至${this.levelUp.skillUpTo! - 1}`;
          }
        case LevelUpType.SPECIALIZE:
          if (this.levelUp.specializeTarget!.specializeRankTo === characterData.skillLevel[this.levelUp.specializeTarget!.specializeSkill] + 1) {
            return true;
          } else {
            return `请先将${this.skillName(this.levelUp.specializeTarget!.specializeSkill, characterData)}升级至Rank ${this.levelUp.specializeTarget!.specializeRankTo - 1}`;
          }
      }
      return false;
    }

    private compositeOne(id: string) {
      this.composite({id, count: 1});
    }

    private composite(item: CostItem) {
      const canComposite = this.checkComposite(item);

      if (!canComposite) {
        this.snackbar = true;
        return;
      }
      this.$store.commit(Mutations.ChangeItem, {item: item.id, amount: item.count});
      this.getCompositeItems(item.id).forEach((toComposite) => {
        this.$store.commit(Mutations.ChangeItem, {item: toComposite.id, amount: -item.count * toComposite.count});
      });

      this.calculateSuggestion();
      this.compositeSnackbar = true;
      this.compositeBonusItems = this.AllMaterials.filter((material) => this.itemDetail(material).rarity === this.itemDetail(item.id).rarity - 1);
    }

    private checkComposite(item: CostItem): boolean {
      if (this.getCompositeItems(item.id)) {
        const compositeItems: Array<CostItem> = this.getCompositeItems(item.id);
        const isItemEnough = compositeItems.filter((toComposite) => {
          return (this.getItemAmountInWarehouse(toComposite.id)) < (toComposite.count * item.count);
        }).length === 0;
        if (!isItemEnough) {
          this.snackbarMessage = '材料不足';
        }
        return isItemEnough;
      } else {
        this.snackbarMessage = '无法合成';
        return false;
      }
    }

    private getItemAmountInWarehouse(item: string) {
      return this.warehouseItemCounts[item] || 0;
    }

    private compositeClass(compositeItem: CostItem, itemCount: number): { [className: string]: boolean } {
      const warehouseAmount = this.getItemAmountInWarehouse(compositeItem.id);
      return {
        'red--text': compositeItem.count > warehouseAmount,
        'green--text': compositeItem.count * itemCount <= warehouseAmount,
      };
    }
  }
</script>
