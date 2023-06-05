import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bullet } from '@consta/charts/Bullet';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getDrillingInstrumentUsage } from '../../smb_frontend/src/utils/drilling/drilling';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';

const InstrumentUsageChart: React.FC<TelemetryCardSimpleProps> = ({ loading, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);

  // Использование инструментов ЦБ, %
  const drillingInstrumentsUsage = useMemo(() => getDrillingInstrumentUsage(telemetryData), [telemetryData]);
  const showDrillingInstrumentsUsage = selected && drillingInstrumentsUsage?.length > 0;

  return (
    <TelemetryCard title='Использование инструментов ЦБ, %' loading={loading} showContent={showDrillingInstrumentsUsage}>
      <Bullet
        data={drillingInstrumentsUsage}
        measureField='measures'
        rangeField='ranges'
        targetField='target'
        xField='title'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        label={{
          measure: {
            position: 'middle',
            style: {
              fill: 'black',
              fontSize: 11,
            },
          },
        }}
        tooltip={false}
        color={{
          measure: ['#22C38E', '#F2C94C'],
        }}
        autoFit
        animation={false}
      />
    </TelemetryCard>
  );
};

export default InstrumentUsageChart;
