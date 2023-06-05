import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bullet } from '@consta/charts/Bullet';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getSpoInstumentUsage } from '../../smb_frontend/src/utils/drilling/spo';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';

const InstrumentUsageChart: React.FC<TelemetryCardSimpleProps> = ({ loading, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);
  const spoInstumentsUsage = useMemo(() => getSpoInstumentUsage(telemetryData), [telemetryData]);

  return (
    <TelemetryCard
      title='Использование инструментов ЦБ, %'
      loading={loading}
      showContent={spoInstumentsUsage?.length > 0}
    >
      {selected && (
        <Bullet
          data={spoInstumentsUsage}
          measureField='measures'
          rangeField='ranges'
          targetField='target'
          xField='title'
          color={{
            measure: ['#22C38E', '#F2C94C'],
          }}
          animation={false}
        />
      )}
    </TelemetryCard>
  );
};

export default InstrumentUsageChart;
