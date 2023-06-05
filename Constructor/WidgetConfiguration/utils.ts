import { AKBType, EConstructionType, ENPVType, EPenetrationType } from '@/types/dataTypes';
import {
  chartTypeItems,
  columnChartItems,
  lineAndColumnChartItems,
  pieAndColumnChartItems,
} from '@/components/Constructor/WidgetConfiguration/selectOptions';
import { EChartType } from '@/types/graphTypes';
import { TWidgetOptions } from '@/types/widgetTypes';
import { DatasetNumber } from '@/components/Constructor/WidgetConfiguration/types';
import {
  MAX_NUMBER_OF_OBJECTS_HISTOGRAM,
  MAX_NUMBER_OF_OBJECTS_NORMALIZED_HISTOGRAM,
  MAX_NUMBER_OF_OBJECTS_STACKED_HISTOGRAM,
} from '@/constants/env';

export type NamesMap = { [key: string]: string };

export const getNestedNamesMap = <Type extends NamesMap>(namesMap: Type, parentName: string): typeof namesMap => {
  const result = {} as NamesMap;

  for (const key in namesMap) {
    result[key] = `${parentName}.${namesMap[key]}`;
  }

  return result as Type;
};

export const getChartViewItems = (
  type: TWidgetOptions['type'],
  inDynamics: TWidgetOptions['inDynamics'],
  byObjects: TWidgetOptions['byObjects'],
) => {
  switch (type) {
    case ENPVType.service:
    case ENPVType.byType:
    case AKBType.drillingFinal:
    case ENPVType.timeBalance:
      if (inDynamics) {
        return [...columnChartItems, { id: EChartType.line, label: 'Линейный график' }];
      } else if (byObjects) {
        return columnChartItems;
      }
      return pieAndColumnChartItems;

    case ENPVType.accidentRate:
    case ENPVType.accidentSeverityCoefficient:
    case EPenetrationType.fact:
    case ENPVType.npv:
    case EPenetrationType.plan:
    case EPenetrationType.mechanicalPenetrationRate:
      if (inDynamics) {
        return lineAndColumnChartItems;
      } else if (byObjects) {
        return [{ id: EChartType.column, label: 'Гистограмма' }];
      }
      return [];

    case EPenetrationType.penetrationPlanFact:
      if (inDynamics) {
        return [];
      }
      return [{ id: EChartType.column, label: 'Гистограмма' }];
    case EConstructionType.constructionSpeed:
      if (inDynamics) {
        return lineAndColumnChartItems;
      }
      return [{ id: EChartType.column, label: 'Гистограмма' }];
    default:
      return chartTypeItems;
  }
};

export const getDualChartViewItems = (
  datasetNumber: DatasetNumber,
  chartView: TWidgetOptions['chartView'],
  secondChartView: TWidgetOptions['chartView'],
) => {
  if ((!datasetNumber && secondChartView === EChartType.column) || (datasetNumber && chartView === EChartType.column)) {
    return [
      { id: EChartType.line, label: 'Линейный график' },
      { id: EChartType.column, label: 'Гистограмма', disabled: true },
    ];
  } else {
    return lineAndColumnChartItems;
  }
};

export const getMaxCountObjects = (graphType: EChartType): number => {
  switch (graphType) {
    case EChartType.column:
      return +MAX_NUMBER_OF_OBJECTS_HISTOGRAM;
    case EChartType.stackedColumn:
      return +MAX_NUMBER_OF_OBJECTS_STACKED_HISTOGRAM;
    case EChartType.normalizedStackedColumn:
      return +MAX_NUMBER_OF_OBJECTS_NORMALIZED_HISTOGRAM;
    default:
      return 20;
  }
};
