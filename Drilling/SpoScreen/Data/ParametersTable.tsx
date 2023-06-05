import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '@consta/uikit/Table';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getSpoTableData } from '../../smb_frontend/src/utils/drilling/spo';
import { ChooseAssetText, EmptyAssetsDataText } from '../../smb_frontend/src/utils/drilling/helpers';
import { useContainerSize } from '../../smb_frontend/src/hooks/drilling/useContainerSize';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';
import styles from '../../DrillingTelemetry.module.scss';

export const ParametersTable: React.FC<TelemetryCardSimpleProps> = ({ loading, noData, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);

  // Список анализируемых параметров таблица
  const [spoTelemetryColumns, spoTelemetryRows] = useMemo(() => getSpoTableData(telemetryData), [telemetryData]);
  const showSpoTableData = spoTelemetryColumns?.length > 0 && spoTelemetryRows?.length > 0;

  const [containerRef, { isUpdating }] = useContainerSize();

  return (
    <TelemetryCard title='Список анализируемых параметров' loading={loading}>
      {selected && noData ? (
        <div className={styles.centerContainer}>
          <EmptyAssetsDataText />
        </div>
      ) : selected ? (
        <div ref={containerRef}>
          {showSpoTableData && !isUpdating && (
            <Table
              columns={spoTelemetryColumns}
              rows={spoTelemetryRows}
              borderBetweenColumns
              borderBetweenRows
              size='m'
              className={styles.TableWithBottomBorder}
            />
          )}
        </div>
      ) : (
        !noData && (
          <div className={styles.centerContainer}>
            <ChooseAssetText />
          </div>
        )
      )}
    </TelemetryCard>
  );
};

export default ParametersTable;
