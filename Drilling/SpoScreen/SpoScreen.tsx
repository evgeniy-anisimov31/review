import React from 'react';
import { useSelector } from 'react-redux';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { ParametersTable, InstrumentUsageChart, SpoSpeedDynamicsChart } from 'review/Drilling/SpoScreen/Data';
import styles from '../DrillingTelemetry.module.scss';

export const SpoScreen = () => {
  const {
    telemetryLoading: loading,
    isTelemetryDataEmpty: empty,
    selectedAssets,
    selectedSections,
  } = useSelector(selectDrilling);
  const selected = selectedAssets.length > 0 || selectedSections.length > 0;

  return (
    <div className={styles.dataGrid}>
      <div className={styles.slotA}>
        <ParametersTable loading={loading} selected={selected} noData={!loading && empty} />
      </div>
      <div className={styles.slotBC}>
        <InstrumentUsageChart loading={loading} selected={selected} />
      </div>
      <div className={styles.slotD}>
        <SpoSpeedDynamicsChart loading={loading} selected={selected} />
      </div>
    </div>
  );
};
