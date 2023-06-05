import { EChartType } from '@/types/graphTypes';
import {
  AKBType,
  EFlightType,
  ENPVType,
  EObjectsLevel,
  EPenetrationType,
  EWidgetDataKind,
  EXAxis,
  EConstructionType,
  WidgetType,
} from '@/types/dataTypes';

export const chartTypeItems = [
  { id: EChartType.pie, label: 'Круговая диаграмма' },
  { id: EChartType.donut, label: 'Инвертированная круговая диаграмма' },
  { id: EChartType.line, label: 'Линейный график' },
  { id: EChartType.column, label: 'Гистограмма' },
  { id: EChartType.stackedColumn, label: 'Гистограмма с накоплением' },
  { id: EChartType.normalizedStackedColumn, label: 'Нормированная гистограмма с накоплением' },
];

export const lineAndColumnChartItems = [
  { id: EChartType.line, label: 'Линейный график' },
  { id: EChartType.column, label: 'Гистограмма' },
];

export const pieAndColumnChartItems = [
  { id: EChartType.pie, label: 'Круговая диаграмма' },
  { id: EChartType.column, label: 'Гистограмма' },
  { id: EChartType.donut, label: 'Инвертированная круговая диаграмма' },
];

export const columnChartItems = [
  { id: EChartType.column, label: 'Гистограмма' },
  { id: EChartType.stackedColumn, label: 'Гистограмма с накоплением' },
  { id: EChartType.normalizedStackedColumn, label: 'Нормированная гистограмма с накоплением' },
];

export const dataItems = [
  { label: 'НПВ', id: EWidgetDataKind.npv },
  { label: 'Проходка', id: EWidgetDataKind.penetration },
  { label: 'Строительство', id: EWidgetDataKind.construction },
  // todo: Рейсы на этапе обсуждения с заказчиком (пока disabled)
  { label: 'АКБ', id: EWidgetDataKind.akb },
  { label: 'Рейсы', id: EWidgetDataKind.flights, disabled: true },
];

// Типы данных, которые можно выбрать только для Dual Axes!
export const dualAxesDataTypeItems = {
  penetration: [
    { label: 'Проходка (факт)', id: EPenetrationType.fact },
    { label: 'Проходка (план)', id: EPenetrationType.plan },
    { label: 'Механическая скорость проходки', id: EPenetrationType.mechanicalPenetrationRate },
  ],
  npv: [
    { label: 'НПВ', id: ENPVType.npv },
    { label: 'НПВ по видам сервиса', id: ENPVType.service },
    { label: 'НПВ по типам', id: ENPVType.byType },
    { label: 'Коэффициент аварийности', id: ENPVType.accidentRate },
    { label: 'Коэффициент тяжести аварий', id: ENPVType.accidentSeverityCoefficient },
  ],
  construction: [{ label: 'Скорость строительства', id: EConstructionType.constructionSpeed }],
  akb: [
    {
      label: 'Законченные бурением',
      id: AKBType.drillingFinal,
      inDynamics: true,
      nothingSelected: true,
    },
  ],
};

type DataTypeItem = {
  label: string;
  id: WidgetType;
  inDynamics?: boolean;
  byObjects?: boolean;
  nothingSelected?: boolean;
};

export const dataTypeItems: Record<EWidgetDataKind, DataTypeItem[]> = {
  npv: [
    { label: 'НПВ', id: ENPVType.npv, inDynamics: true, byObjects: true },
    {
      label: 'НПВ по видам сервиса',
      id: ENPVType.service,
      inDynamics: true,
      byObjects: true,
      nothingSelected: true,
    },
    {
      label: 'НПВ по типам',
      id: ENPVType.byType,
      inDynamics: true,
      byObjects: true,
      nothingSelected: true,
    },
    { label: 'Баланс времени', id: ENPVType.timeBalance, byObjects: true, nothingSelected: true },
    { label: 'Коэффициент аварийности', id: ENPVType.accidentRate, inDynamics: true, byObjects: true },
    {
      label: 'Коэффициент тяжести аварий',
      id: ENPVType.accidentSeverityCoefficient,
      inDynamics: true,
      byObjects: true,
    },
  ],
  penetration: [
    {
      label: 'Проходка (факт)',
      id: EPenetrationType.fact,
      inDynamics: true,
      byObjects: true,
    },
    { label: 'Проходка (план)', id: EPenetrationType.plan, inDynamics: true, byObjects: true },
    {
      label: 'Проходка (план/факт)',
      id: EPenetrationType.penetrationPlanFact,
      byObjects: true,
      nothingSelected: true,
    },
    {
      label: 'Механическая скорость проходки',
      id: EPenetrationType.mechanicalPenetrationRate,
      inDynamics: true,
      byObjects: true,
    },
  ],
  construction: [
    {
      label: 'Скорость строительства',
      id: EConstructionType.constructionSpeed,
      inDynamics: true,
      byObjects: true,
      nothingSelected: true,
    },
  ],
  flights: [
    { label: 'Рейсовая скорость в разрезе рейсов', id: EFlightType.flightSpeedByContext },
    { label: 'Рейсовая скорость в разрезе секций', id: EFlightType.flightSpeedBySections },
  ],
  akb: [
    {
      label: 'Законченные бурением',
      id: AKBType.drillingFinal,
      inDynamics: true,
      nothingSelected: true,
    },
  ],
};

export const getDataItems = (inDynamics?: boolean, byObjects?: boolean) => {
  if (inDynamics) {
    return dataItems.filter((item) => item.id !== EWidgetDataKind.flights);
  }

  if (byObjects) {
    return dataItems.filter((item) => item.id !== EWidgetDataKind.flights && item.id !== EWidgetDataKind.akb);
  }

  return dataItems;
};

export const getDataTypeItems = (chartData: EWidgetDataKind, inDynamics?: boolean, byObjects?: boolean) => {
  if (chartData !== EWidgetDataKind.flights) {
    if (inDynamics) {
      return dataTypeItems[chartData].filter((item) => item.inDynamics);
    } else if (byObjects) {
      return dataTypeItems[chartData].filter((item) => item.byObjects);
    }

    return dataTypeItems[chartData].filter((item) => item.nothingSelected);
  }

  return dataTypeItems[chartData];
};

export const xAxisItems = [
  { label: 'Неделя', id: EXAxis.week },
  { label: 'Месяц', id: EXAxis.month },
  { label: 'Квартал', id: EXAxis.quarter },
  { label: 'Год', id: EXAxis.year },
];

export const objectItems = [
  { label: 'ДО', id: EObjectsLevel.ownerName },
  { label: 'Месторождения', id: EObjectsLevel.localityName },
  { label: 'Кусты', id: EObjectsLevel.clusterName },
  { label: 'Скважины', id: EObjectsLevel.wellName },
];
