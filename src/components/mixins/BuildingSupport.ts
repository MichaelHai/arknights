import {Component, Vue} from 'vue-property-decorator';
import {CostItem, RoomType} from '@/model';
import BuildingData from '@/assets/ArknightsGameData/excel/building_data.json';

@Component
export default class BuildingSupport extends Vue {
  protected getBuildingFormulas(formulaId: string, type: RoomType): BuildingFormula {
    let formulas: { [id: string]: BuildingFormula };
    switch (type) {
      case 'MANUFACTURE':
        formulas = BuildingData.manufactFormulas as { [id: string]: BuildingFormula };
        break;
      case 'WORKSHOP':
        formulas = BuildingData.workshopFormulas as { [id: string]: BuildingFormula };
        break;
      default:
        formulas = {};
    }
    return formulas[formulaId];
  }
}

export interface BuildingFormula {
  formulaId: string;
  itemId: string;
  costs: Array<CostItem>;
}
