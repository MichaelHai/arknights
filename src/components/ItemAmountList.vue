<template>
  <div>
    <v-row dense @click.stop="showDialog = true">
      <v-col cols="3" class="ma-auto">{{ title }}</v-col>
      <v-col cols="9">
        <v-row dense>
          <template v-for="item in items">
            <v-col cols="6" :key="item.item">
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
            <v-btn text @click="levelUp">完成</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pa-0 pt-12">
          <v-card elevation="0">
            <v-card-subtitle>需求一览</v-card-subtitle>
            <v-card-text>
              <v-row dense>
                <v-col cols="4" v-for="item in items" :key="`dialog_${item.item}`">
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
                        <v-col cols="2" :key="`shortage_icon_${item.item}`">
                          <item-avatar
                            :item="item.item"
                            :text="`× ${item.amount}`"
                          />
                        </v-col>
                        <v-col cols="4" :key="`shortage_map_${item.item}`" class="ma-auto">
                          <v-row v-if="itemDetails[item.item] && itemDetails[item.item].suggest === 'map'" dense>
                            <v-btn
                              v-for="map in itemDetails[item.item].map"
                              :key="`btn_${map}`"
                              @click.stop="mapClicked(map)"
                              small
                              tile
                              class="ma-1"
                            >
                              {{ map }}
                            </v-btn>
                          </v-row>
                        </v-col>
                      </template>
                      <v-col cols="6" v-if="mapItems.length % 2 === 1" />
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider/>

            <v-card-subtitle>建议合成</v-card-subtitle>
            <v-card-text>
              <v-list dense>
                <v-list-item v-for="item in compositeItems" :key="`shortage_${item.item}`" dense class="pa-0">
                  <v-list-item-content>
                    <v-row dense justify="center">
                      <v-col cols="2">
                        <item-avatar
                          :item="item.item"
                          :text="`× ${item.amount}`"
                        />
                      </v-col>
                      <v-col cols="1" class="ma-auto">
                        <span>=</span>
                      </v-col>
                      <template v-if="itemDetails[item.item] && itemDetails[item.item].composite">
                        <v-col
                          v-for="compositeItem in itemDetails[item.item].composite"
                          :key="`composite_${item.item}_${compositeItem.item}`"
                          cols="2"
                        >
                          <item-avatar
                            :item="compositeItem.item"
                            :text="`${compositeItem.amount} / ${ warehouseItemCounts[compositeItem.item] || 0 }`"
                          />
                        </v-col>
                      </template>
                      <v-spacer/>
                      <v-col cols="3" class="text-end">
                        <v-btn small tile class="ma-1">合成</v-btn>
                        <v-btn small tile class="ma-1"> 全部</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <loot-dialog
      :map="lootDialogMap"
      v-model="lootDialog"
    />
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {Item, ItemAmount, ItemDetail} from '@/model';
  import ItemRequirement from '@/components/ItemRequirement.vue';
  import LootDialog from '@/components/LootDialog.vue';
  import MasterData from '@/assets/master-data.json';
  import ItemAvatar from '@/components/ItemAvatar.vue';

  @Component({
    components: {ItemAvatar, LootDialog, ItemRequirement},
  })
  export default class ItemAmountList extends Vue {
    @Prop()
    public items!: Array<ItemAmount>;
    @Prop()
    public title!: string;

    private showDialog: boolean = false;
    private mapItems: Array<ItemAmount> = [];
    private compositeItems: Array<ItemAmount> = [];
    private lootDialog: boolean = false;
    private lootDialogMap: string = '';
    private itemDetails: { [item in Item]: ItemDetail } = MasterData.items;

    private get warehouseItemCounts(): { [item in Item]: number } {
      return this.$store.state.itemCounts;
    }

    @Watch('showDialog')
    private showDialogChanged() {
      if (this.showDialog) {
        const unprocessedItems: Array<ItemAmount> = [...this.items];
        const mapItemsMap = new Map<Item, number>();
        const compositeItemsMap = new Map<Item, number>();
        for (let item of unprocessedItems) {
          const itemName = item.item;
          if (this.itemDetails[itemName].suggest === 'map') {
            this.addToMap(item, mapItemsMap);
          } else {
            this.addToMap(item, compositeItemsMap);
            const compositeItems: Array<ItemAmount> = this.itemDetails[itemName].composite!;
            unprocessedItems.push(...compositeItems);
          }
        }

        this.addToList(mapItemsMap, this.mapItems);
        this.addToList(compositeItemsMap, this.compositeItems);
      } else {
        this.mapItems = [];
        this.compositeItems = [];
      }
    }

    private addToList(map: Map<Item, number>, list: Array<ItemAmount>) {
      map.forEach((amount, item) => {
        const warehouseItemCount = this.warehouseItemCounts[item] || 0;
        if (amount > warehouseItemCount) {
          list.push({
            item,
            amount: amount - warehouseItemCount,
          });
        }
      });
    }

    private addToMap(item: ItemAmount, mapItemsMap: Map<Item, number>) {
      const itemName = item.item;
      let count = item.amount;
      if (mapItemsMap.has(itemName)) {
        count += mapItemsMap.get(itemName)!;
      }
      mapItemsMap.set(itemName, count);
    }

    private mapClicked(map: string) {
      this.lootDialog = true;
      this.lootDialogMap = map;
    }

    private levelUp() {
      this.showDialog = false;
    }
  }
</script>
