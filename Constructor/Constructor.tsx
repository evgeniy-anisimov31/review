import React, { useCallback } from 'react';
import ReactGridLayout from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@consta/uikit/Loader';

import { isEqual } from '@/utils/common';
import { TWidget } from '@/types/widgetTypes';
import { removeWidget } from '@/store/widgets/widgetsSlice';
import { selectDashboards, selectWidgets, selectWidgetsData } from '@/store/selectors';
import { TGridProps } from '@/types/dashboardTypes';
import { updateDashboard } from '@/store/dashboards/dashboardsSlice';
import { useAuth } from '@/auth/AuthContext/AuthContext';
import WidgetConfigurationModal from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationModal';
import ConstructorGrid from './ConstructorGrid';
import SelectWidget from './WidgetContainer/WidgetContainer';
import css from '../Filters/Filters.module.scss';

type TConstructor = {
  sheetGrid: ReactGridLayout.Layout[];
  setSheetGrid: (val: ReactGridLayout.Layout[]) => void;
  widgetData: TWidget[];
};

const Constructor: React.FC<TConstructor> = ({ sheetGrid, setSheetGrid, widgetData }) => {
  const { widgetModalState } = useSelector(selectWidgets);
  const { widgetsDataMap } = useSelector(selectWidgetsData);
  const { actualDashboard: dashboardById } = useSelector(selectDashboards);
  const dispatch = useDispatch();
  const allowChange = true;
  const { userData } = useAuth();

  const onRemoveItem = useCallback(
    async (id: number) => {
      if (dashboardById) {
        await dispatch(removeWidget(id, dashboardById));
      }
    },
    [dashboardById, dispatch]
  );

  const onLayoutChange = useCallback(
    (layout: ReactGridLayout.Layout[]) => {
      const newGrid = layout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }));

      if (!isEqual(sheetGrid, newGrid)) {
        const updatedGrid = dashboardById?.data.map((dashboard) => {
          const currentGrid = newGrid?.find((grid) => grid.i === String(dashboard.id));

          return { ...dashboard, options: currentGrid };
        }) as TGridProps[];

        if (userData?.uid && dashboardById?.id) {
          dispatch(updateDashboard({ ...dashboardById, data: updatedGrid }, dashboardById.id));
        }
      }
    },
    [sheetGrid, dashboardById, userData?.uid, dispatch]
  );

  const renderItem = useCallback(
    (id: string) => <SelectWidget widgets={widgetData} id={Number(id)} onClickRemove={onRemoveItem} />,
    [widgetData, onRemoveItem]
  );

  return (
    <div className={css.position}>
      <ConstructorGrid
        layout={sheetGrid}
        onChange={setSheetGrid}
        onLayoutChange={onLayoutChange}
        onRemoveItem={onRemoveItem}
        renderItem={renderItem}
        allowChange={allowChange}
      />
      {widgetModalState.widgetData && <WidgetConfigurationModal onRemoveWidget={onRemoveItem} />}
      {!Object.values(widgetsDataMap).some((item) => item.isLoading) || (
        <div className={css.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Constructor;
