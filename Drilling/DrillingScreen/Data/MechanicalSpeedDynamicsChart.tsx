import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Column } from '@consta/charts/Column';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getDrillingSpeedDynamicGraphData } from '../../smb_frontend/src/utils/drilling/drilling';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';

const MechanicalSpeedDynamicsChart: React.FC<TelemetryCardSimpleProps> = ({ loading, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);

  // Динамика механической скорости, %
  const drillingSpeedDynamic = useMemo(() => getDrillingSpeedDynamicGraphData(telemetryData), [telemetryData]);
  const showDrillingSpeedDynamic = selected && drillingSpeedDynamic?.length > 0;

  return (
    <TelemetryCard title='Динамика механической скорости, м/ч' loading={loading} showContent={showDrillingSpeedDynamic}>
      <Column
        data={drillingSpeedDynamic}
        xField='method'
        yField='value'
        isGroup
        seriesField='method'
        color={['#56b9f2']}
        legend={false}
        autoFit
        animation={false}
        columnWidthRatio={1.2}
      />
    </TelemetryCard>
  );
};

export default MechanicalSpeedDynamicsChart;
