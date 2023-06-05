import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Column } from '@consta/charts/Column';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getSpoSpeedRateColumnData } from '../../smb_frontend/src/utils/drilling/spo';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';

const SpoSpeedDynamicsChart: React.FC<TelemetryCardSimpleProps> = ({ loading, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);

  // Динамика скорости СПО, %
  const spoSpeedRate = useMemo(() => getSpoSpeedRateColumnData(telemetryData), [telemetryData]);

  return (
    <TelemetryCard title='Динамика скорости СПО, м/ч' loading={loading} showContent={spoSpeedRate?.length > 0}>
      {selected && (
        <Column
          data={spoSpeedRate}
          xField='method'
          yField='value'
          isGroup
          color='#56B9F2'
          meta={{
            value: {
              alias: 'Значение',
            },
          }}
          animation={false}
        />
      )}
    </TelemetryCard>
  );
};

export default SpoSpeedDynamicsChart;
