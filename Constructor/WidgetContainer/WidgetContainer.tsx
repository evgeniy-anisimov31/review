import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Radio } from '@consta/uikit/Radio';
import { Text } from '@consta/uikit/Text';

import { Widget } from '@/ui/Widget';
import { TWidget } from '@/types/widgetTypes';
import { selectFilters, selectWidgetsData } from '@/store/selectors';
import { EFlightType, ENPVType, EPenetrationType, TWidgetData } from '@/types/dataTypes';
import { setWidgetModalState } from '@/store/widgets/widgetsSlice';
import {
  getDualGraphData,
  getDualDataTypeLabel,
  getSortedGraphData,
  getGraphData,
} from '@/components/Constructor/WidgetContainer/common';
import WidgetData from './WidgetData/WidgetData';
import { AlertFlight } from '@/components/Constructor/WidgetContainer/FlightAlert';
import { ObjectLevelAlert } from '@/components/Constructor/WidgetContainer/ObjectLevelAlert';
import { getMaxCountObjects } from '@/components/Constructor/WidgetConfiguration/utils';
import { WidgetGetParameters } from '@/constants/names';
import { getUniqueObjectsCount } from '@/utils/graphData/helpers';
import { useWidgetDataLoader } from '@/domains/widgetData/useWidgetDataLoader';
import styles from './WidgetContainer.module.scss';

type TSelectWidgetProps = {
  id: number;
  onClickRemove: (id: number) => Promise<void>;
  widgets: TWidget[];
};

const WidgetContainer: FC<TSelectWidgetProps> = ({ id, onClickRemove, widgets }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id: dashboardId } = useParams<{ id: string }>();
  const { checkedTreeValues } = useSelector(selectFilters);
  const { widgetsDataMap } = useSelector(selectWidgetsData);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [removeLoading, setRemoveLoading] = useState(false);

  const currentWidget = useMemo(() => widgets.find((el) => el.id === id) as TWidget, [id, widgets]);

  const currentWidgetMap = currentWidget ? widgetsDataMap[currentWidget.id] : null;
  const widgetData = currentWidgetMap?.chart;

  // фильтр скважин для графиков рейсовой скорости
  const isShowFlightCharts = useMemo(
    () => checkedTreeValues.filter((item) => /^(well)/.test(item.toString())).length === 1,
    [checkedTreeValues],
  );

  const dualChartData = useMemo(() => {
    if (!currentWidget) {
      return;
    }

    if (currentWidget.options?.isTwoSetsOfData) {
      const data = getDualGraphData(currentWidget);

      if (data) {
        return { graph1: data[0], graph2: data[1] };
      }
    }
  }, [widgetData, currentWidget]);

  const chartData = useMemo(() => {
    if (!currentWidget) {
      return;
    }

    return getGraphData(currentWidget, isShowFlightCharts) || [];
  }, [widgetData, currentWidget]);

  const closeModal = useCallback(async () => {
    setRemoveLoading(true);
    await onClickRemove(id);
    setRemoveLoading(false);
    setShowConfirmModal(false);
  }, [id, onClickRemove]);

  const openTableView = useCallback(
    (widget: TWidget, type?: string) => {
      const tableViewType = type || widget.options?.type;
      const dashboardWrapper = document.getElementById('dashboardWrapper');

      history.push(
        `/dashboard/${dashboardId}?${WidgetGetParameters.tableViewId}=${widget.id}&${WidgetGetParameters.tableViewType}=${tableViewType}`,
      );
      dashboardWrapper?.scrollTo(0, 0);
    },
    [dashboardId],
  );

  const setSelectedDataType = useCallback(
    (type: EPenetrationType | ENPVType) => {
      setShowSelectTypeModal(false);
      openTableView(currentWidget as TWidget, type);
    },
    [currentWidget],
  );

  const onClickTableView = useCallback(() => {
    if (
      currentWidget?.options?.type === EPenetrationType.penetrationPlanFact ||
      currentWidget?.options?.isTwoSetsOfData
    ) {
      setShowSelectTypeModal(true);
    } else {
      openTableView(currentWidget as TWidget);
    }
  }, [currentWidget]);

  const sortedGraphData = useMemo(() => {
    const xAxis = currentWidget?.options?.xAxis;
    // сортируем набор данных только если у него указан интервал (xAxis)
    return chartData?.length && xAxis ? getSortedGraphData(chartData, xAxis) : chartData;
  }, [chartData]);

  const showFlightsChart = useMemo(() => {
    return Object.values(EFlightType).includes(currentWidget?.options?.type as EFlightType) && !isShowFlightCharts;
  }, [currentWidget?.options?.type, isShowFlightCharts]);

  /** Количество уникальных объектов в пришедших данных */
  const dataObjectsCount = useMemo(() => getUniqueObjectsCount(widgetData as TWidgetData[]), [widgetData]);

  /** Условие вывода <ObjectLevelAlert /> */
  const isShowObjectLevelChart = useMemo(() => {
    if (currentWidget?.options?.chartView) {
      return getMaxCountObjects(currentWidget?.options?.chartView) >= (dataObjectsCount || 0);
    }
  }, [currentWidget?.options?.chartView, dataObjectsCount]);

  const showObjectLevelCharts = useMemo(() => {
    return currentWidget?.options?.objectLevel && !isShowObjectLevelChart;
  }, [currentWidget?.options?.objectLevel, isShowObjectLevelChart]);

  useWidgetDataLoader(currentWidget);

  return (
    <>
      <Widget
        name={currentWidget?.name}
        description={currentWidget?.description}
        onEdit={() => currentWidget && dispatch(setWidgetModalState({ widgetData: currentWidget, isNew: false }))}
        onRemove={() => setShowConfirmModal(true)}
      >
        {showFlightsChart && !showObjectLevelCharts && <AlertFlight />}
        {showObjectLevelCharts && !showFlightsChart && currentWidget?.options?.chartView && (
          <ObjectLevelAlert
            maxCount={getMaxCountObjects(currentWidget?.options?.chartView)}
            selectedCount={dataObjectsCount}
          />
        )}
        {!showFlightsChart && !showObjectLevelCharts && currentWidget?.options?.chartView && (
          <>
            <WidgetData
              data={sortedGraphData}
              dualData={dualChartData}
              options={currentWidget?.options}
              chartProps={{
                column: chartPropsColumn(currentWidget?.options),
                line: chartPropsLine(currentWidget?.options),
              }}
            />
            <div>
              <Button
                test-id={'tbView'}
                className={styles.tableButton}
                size='s'
                view='ghost'
                label='Табличный вид'
                onClick={onClickTableView}
              />
            </div>
          </>
        )}
      </Widget>
      <Modal className={styles.modal} onOverlayClick={() => setShowConfirmModal(false)} isOpen={showConfirmModal}>
        <Text>Вы действительно хотите удалить виджет «{currentWidget?.name}»?</Text>
        <div className={styles.buttons}>
          <Button view='secondary' label='Отменить' onClick={() => setShowConfirmModal(false)} />
          <Button
            loading={removeLoading}
            disabled={removeLoading}
            className={styles.button}
            label='Удалить'
            onClick={closeModal}
          />
        </div>
      </Modal>
      <Modal
        className={styles.typeModal}
        onClickOutside={() => setShowSelectTypeModal(false)}
        isOpen={showSelectTypeModal}
        onClose={() => setShowSelectTypeModal(false)}
      >
        <div onMouseDownCapture={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <Text weight='bold'>Выберите данные</Text>
          <div className={styles.radio}>
            {currentWidget?.options?.isTwoSetsOfData ? (
              <>
                <Radio
                  label={getDualDataTypeLabel(currentWidget?.options?.type ?? '')}
                  onChange={() => setRadioValue(currentWidget?.options?.type ?? '')}
                  checked={radioValue === currentWidget?.options?.type}
                />
                <Radio
                  label={getDualDataTypeLabel(currentWidget?.options?.secondOptions?.type ?? '')}
                  className={styles.button}
                  onChange={() => setRadioValue(currentWidget?.options?.secondOptions?.type ?? '')}
                  checked={radioValue === currentWidget?.options?.secondOptions?.type}
                />
              </>
            ) : (
              <>
                <Radio
                  label='План'
                  onChange={() => setRadioValue(EPenetrationType.plan)}
                  checked={radioValue === EPenetrationType.plan}
                />
                <Radio
                  label='Факт'
                  className={styles.button}
                  onChange={() => setRadioValue(EPenetrationType.fact)}
                  checked={radioValue === EPenetrationType.fact}
                />
              </>
            )}
          </div>
          <div className={styles.typeButtons}>
            <Button
              test-id={'cancel'}
              view='secondary'
              label='Отменить'
              onClick={() => setShowSelectTypeModal(false)}
            />
            <Button
              test-id={'add'}
              className={styles.button}
              disabled={!radioValue}
              label='Применить'
              onClick={() => setSelectedDataType(radioValue as EPenetrationType)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(WidgetContainer);

function chartPropsColumn(options: TWidget['options'] | undefined) {
  if (options?.type === ENPVType.npv) {
    return {
      color: ['#55A7F3'],
      legend: {
        layout: 'vertical',
        position: 'right',
        animate: false,
      },
    };
  }

  return undefined;
}

function chartPropsLine(options: TWidget['options'] | undefined) {
  switch (options?.type) {
    case ENPVType.npv:
      return {
        legend: {
          layout: 'vertical',
          position: 'right',
          animate: false,
        },
      };
  }

  return undefined;
}
