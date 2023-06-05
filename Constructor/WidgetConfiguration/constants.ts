import { AKBType, EConstructionType, ENPVType, EPenetrationType } from '@/types/dataTypes';
import { TWidgetOptions } from '@/types/widgetTypes';
import { WidgetOptionsFieldNames } from '@/constants/names';

export const disabledTypes: TWidgetOptions['type'][] = [
  ENPVType.service,
  ENPVType.byType,
  ENPVType.timeBalance,
  AKBType.drillingFinal,
  EConstructionType.constructionSpeed,
];

export const disabledObjectLevelTypes: TWidgetOptions['type'][] = [
  EPenetrationType.penetrationPlanFact,
  ENPVType.service,
  ENPVType.byType,
];

/* Наборы данных со всеми видами отображений (by objects, in dynamics, nothing selected) */
export const dataWithAllKindsView = [
  EPenetrationType.penetrationPlanFact,
  ENPVType.service,
  ENPVType.byType,
  ENPVType.timeBalance,
  AKBType.drillingFinal,
  EConstructionType.constructionSpeed,
];

export const clearableFields = [
  WidgetOptionsFieldNames.chartData,
  WidgetOptionsFieldNames.type,
  WidgetOptionsFieldNames.chartView,
];
