import React, { FC, useMemo } from 'react';
import { Text } from '@consta/uikit/Text';

import { LineChart } from '@/ui/charts/LineChart';
import { ColumnChart } from '@/ui/charts/ColumnChart';
import { NormalizedColumnChart } from '@/ui/charts/ColumnChart';
import { DualAxesChart } from '@/ui/charts/DualAxesChart';
import { TGraphData } from '@/ui/types';
import { PieChart } from '@/ui/charts/PieChart';
import { EChartType, TDualAxesData } from '@/types/graphTypes';
import { EFlightType, EWidgetDataKind } from '@/types/dataTypes';
import { TWidget } from '@/types/widgetTypes';

export type TChartProps = {
  column?: unknown;
  line?: unknown;
};

type TWidgetOptions = {
  data?: TGraphData[];
  dualData?: TDualAxesData;
  options?: TWidget['options'];
  chartProps?: TChartProps;
};

const useLineChartToolTipFormatter = (dataType: string) => {
  const formatterProps = useMemo(() => {
    if (dataType === EFlightType.flightSpeedByContext) {
      return {
        tooltip: {
          formatter: (datum: Record<string, unknown>) => {
            return { title: 'Рейс №' + datum?.date, value: datum?.value, name: datum?.type };
          },
        },
      };
    } else {
      return {
        tooltip: {
          formatter: (datum: Record<string, unknown>) => {
            return { title: datum?.date, value: datum?.value, name: datum?.type };
          },
        },
      };
    }
  }, [dataType]);

  return { formatterProps };
};

const WidgetData: FC<TWidgetOptions> = ({ data, dualData, chartProps, options }) => {
  if (!chartProps) {
    chartProps = {} as Record<string, unknown>;
  }

  const { formatterProps } = useLineChartToolTipFormatter(options?.type as string);

  const chartData = Array.isArray(data) ? data : null;
  const chartPropsColumn = chartProps?.column || {};
  const chartPropsLine = chartProps?.line || {};

  const dualDataGraph1Data = Array.isArray(dualData?.graph1) ? dualData?.graph1 : null;
  const dualDataGraph2Data = Array.isArray(dualData?.graph2) ? dualData?.graph2 : null;

  const renderGraph = () => {
    switch (!options?.isTwoSetsOfData ? options?.chartView : EChartType.dualAxes) {
      case EChartType.pie: {
        return chartData && <PieChart data={chartData} />;
      }
      case EChartType.donut: {
        return chartData && <PieChart chartType={'donut'} data={chartData} />;
      }
      case EChartType.column: {
        return chartData && <ColumnChart isGroup data={chartData} {...chartPropsColumn} {...formatterProps} />;
      }
      case EChartType.stackedColumn: {
        return chartData && <ColumnChart isStack isGroup={false} data={chartData} {...chartPropsColumn} />;
      }
      case EChartType.normalizedStackedColumn: {
        return chartData && <NormalizedColumnChart isGroup={false} isPercent isStack data={chartData} />;
      }
      case EChartType.line: {
        return (
          chartData && (
            <LineChart data={chartData} {...chartPropsLine} {...formatterProps} />
          )
        );
      }
      case EChartType.dualAxes: {
        return (
          dualDataGraph1Data &&
          dualDataGraph2Data && (
            <DualAxesChart
              graph1={dualData?.graph1}
              graph2={dualData?.graph2}
              view={options?.chartView}
              secondView={options?.secondOptions?.chartView}
              // Для сортировки по интервалу
              xAxisValue={options?.xAxis}
            />
          )
        );
      }
      case EChartType.default: {
        return <Text>Настройте виджет</Text>;
      }
    }
  };

  return <div>{renderGraph()}</div>;
};

export default WidgetData;
