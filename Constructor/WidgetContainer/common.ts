import {
  AKBType,
  EConstructionType,
  EFlightType,
  ENPVType,
  EPenetrationType,
  EXAxis,
  TFlights,
  TWidgetData,
} from '@/types/dataTypes';
import { TWidget, WidgetData } from '@/types/widgetTypes';
import {
  getNpvDataAccidentRate,
  getNpvDataByTimeBalance,
  getNpvDataByType,
  getNpvData,
  getNpvDataService,
} from '@/utils/graphData/npv/common';
import { getFlightsDataContext, getFlightsDataSection } from '@/utils/graphData/flights/common';
import { TGraphData } from '@/ui/types';
import { getDateByQuarter } from '@/utils/common';
import { getGraphDataGetter } from '@/components/Constructor/WidgetContainer/utils';
import { getDbData } from '@/utils/graphData/helpers';

export function getGraphDataNPV(dbData: unknown[], options: TWidget['options']): TGraphData[] {
  const data = dbData as TWidgetData[];

  switch (options?.type) {
    case ENPVType.npv:
      return getNpvData(data, options);
    case ENPVType.service:
      return getNpvDataService(data, options);
    case ENPVType.byType:
      return getNpvDataByType(data, options);
    case ENPVType.timeBalance:
      return getNpvDataByTimeBalance(data, options);
    case ENPVType.accidentRate:
      return getNpvDataAccidentRate(data, options, 'rate');
    case ENPVType.accidentSeverityCoefficient:
      return getNpvDataAccidentRate(data, options, 'severity');
    default:
      return [];
  }
}

export function getGraphDataFlights(dbData: unknown[], options: TWidget['options']): TGraphData[] {
  const data = dbData as TFlights[];

  switch (options?.type) {
    case EFlightType.flightSpeedByContext:
      return getFlightsDataContext(data);
    case EFlightType.flightSpeedBySections:
      return getFlightsDataSection(data);
    default:
      return [];
  }
}

/** Записывает данные для графика с двумя шкалами */
export const getDualGraphData = ({ id, options }: TWidget): [TGraphData[], TGraphData[]] | undefined => {
  const widgetMap = getDbData(id);
  // Получаем сервис для конкретного типа данных
  const graphDataGetter = getGraphDataGetter(options?.chartData);
  const secondGraphGetter = getGraphDataGetter(options?.secondOptions?.chartData);

  if (!widgetMap?.chart || !graphDataGetter || !secondGraphGetter || !options) {
    return;
  }

  const [firstData, secondData] = widgetMap.chart as [WidgetData, WidgetData];

  return [
    graphDataGetter(firstData, options),
    secondGraphGetter(secondData, {
      ...options,
      chartData: options.secondOptions?.chartData,
      chartView: options.secondOptions?.chartView,
      type: options.secondOptions?.type,
    }),
  ];
};

/** Записывает данные для графика с одной шкалой */
export const getGraphData = ({ id, options }: TWidget, isShowFlightCharts?: boolean): TGraphData[] | undefined => {
  const widgetMap = getDbData(id);

  // Получаем сервис для конкретного типа данных
  const graphDataGetter = getGraphDataGetter(options?.chartData, isShowFlightCharts);

  if (!widgetMap?.chart || !graphDataGetter || !options) {
    return;
  }

  return graphDataGetter(widgetMap.chart as WidgetData, options);
};

export const getDualDataTypeLabel = (type: string): string => {
  switch (type) {
    case EPenetrationType.plan:
      return 'Проходка (план)';
    case EPenetrationType.fact:
      return 'Проходка (факт)';
    case EPenetrationType.mechanicalPenetrationRate:
      return 'Механическая скорость проходки';
    case ENPVType.npv:
      return 'НПВ';
    case ENPVType.service:
      return 'НПВ по видам сервиса';
    case ENPVType.byType:
      return 'НПВ по типам';
    case ENPVType.accidentRate:
      return 'Коэффициент аварийности';
    case ENPVType.accidentSeverityCoefficient:
      return 'Коэффициент тяжести аварий';
    case EConstructionType.constructionSpeed:
      return 'Скорость строительства';
    case AKBType.drillingFinal:
      return 'Законченные бурением';
    default:
      return '';
  }
};

export const getSortedGraphData = (data: TGraphData[], xAxis: EXAxis) => {
  return data?.sort((a, b) => {
    if (xAxis === EXAxis.quarter && a?.date && b?.date) {
      return getDateByQuarter(a.date as string) - getDateByQuarter(b.date as string);
    } else if (xAxis === EXAxis.week && a?.date && b?.date) {
      const aWeek = (a?.date as string)?.split(' - ')[0] as string;
      const bWeek = (b?.date as string)?.split(' - ')[0] as string;

      const [startD, startM, startY] = aWeek.split('.');
      const [endD, endM, endY] = bWeek.split('.');

      const first = `${startY}.${startM}.${startD}`;
      const second = `${endY}.${endM}.${endD}`;

      return new Date(first).getTime() - new Date(second).getTime();
    } else {
      return new Date(a.date as string).getTime() - new Date(b.date as string).getTime();
    }
  });
};
