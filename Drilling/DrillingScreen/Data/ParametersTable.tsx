import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '@consta/uikit/Table';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getDrillingTableData } from '../../smb_frontend/src/utils/drilling/drilling';
import { ChooseAssetText, EmptyAssetsDataText } from '../../smb_frontend/src/utils/drilling/helpers';
import { useContainerSize } from '../../smb_frontend/src/hooks/drilling/useContainerSize';
import TelemetryCard, { TelemetryCardSimpleProps } from 'review/Drilling/TelemetryCard/TelemetryCard';
import styles from '../../DrillingTelemetry.module.scss';

const ParametersTable: React.FC<TelemetryCardSimpleProps> = ({ loading, noData, selected }) => {
  const { telemetryData } = useSelector(selectDrilling);

  // Список анализируемых параметров таблица
  const [drillingTelemetryColumns, drillingTelemetryRows] = useMemo(
    () => getDrillingTableData(telemetryData),
    [telemetryData],
  );
  const showDrillingTableData =
    telemetryData.length > 0 && drillingTelemetryColumns?.length > 0 && drillingTelemetryRows?.length > 0;

  const [containerRef, { isUpdating }] = useContainerSize();

  return (
    <TelemetryCard title='Список анализируемых параметров' loading={loading}>
      {selected && noData ? (
        <div className={styles.centerContainer}>
          <EmptyAssetsDataText />
        </div>
      ) : selected ? (
        <div ref={containerRef}>
          {showDrillingTableData && !isUpdating && (
            <Table
              columns={drillingTelemetryColumns}
              rows={drillingTelemetryRows}
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
