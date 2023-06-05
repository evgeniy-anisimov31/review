import { EWidgetDataKind } from '@/types/dataTypes';
import { getPenetrationGraphData } from '@/utils/graphData/penetration/common';
import { getConstructionGraphData } from '@/utils/graphData/construction/common';
import { getGraphDataFlights, getGraphDataNPV } from '@/components/Constructor/WidgetContainer/common';
import { getAKBGraphData } from '@/utils/graphData/akb/common';

/** Возвращает сервис для получение конкретного типа данных */
export const getGraphDataGetter = (chardData?: EWidgetDataKind | null, isShowFlightCharts?: boolean) => {
  switch (chardData) {
    case EWidgetDataKind.penetration:
      return getPenetrationGraphData;
    case EWidgetDataKind.npv:
      return getGraphDataNPV;
    case EWidgetDataKind.flights:
      // отображаем график только если у нас 1 скважина (если больше, показываем алерт)
      if (isShowFlightCharts) {
        return getGraphDataFlights;
      }
      break;
    case EWidgetDataKind.construction:
      return getConstructionGraphData;
    case EWidgetDataKind.akb:
      return getAKBGraphData;
  }
};