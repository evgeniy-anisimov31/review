import React from 'react';
import { useSelector } from 'react-redux';

import TelemetryCard from 'review/Drilling/TelemetryCard/TelemetryCard';
import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import {
  ParametersTable,
  MechanicalSpeedDynamicsChart,
  InstrumentUsageChart,
  MspChart,
} from 'review/Drilling/DrillingScreen/Data';
import styles from '../DrillingTelemetry.module.scss';

export const DrillingScreen = () => {
  const {
    telemetryLoading: loading,
    isTelemetryDataEmpty: empty,
    selectedAssets,
    selectedSections,
  } = useSelector(selectDrilling);

  const selected = selectedAssets.length > 0 || selectedSections.length > 0;
  const showMSP = selectedSections.length === 0;

  return (
    <div className={styles.dataGrid}>
      <div className={styles.slotA}>
        <ParametersTable loading={loading} selected={selected} noData={!loading && empty} />
      </div>
      <div className={styles.slotB}>
        <MechanicalSpeedDynamicsChart loading={loading} selected={selected} />
      </div>
      <div className={styles.slotC}>
        <InstrumentUsageChart loading={loading} selected={selected} />
      </div>
      <div className={styles.slotD}>
        {showMSP ? <MspChart loading={loading} selected={selected} /> : <TelemetryCard />}
      </div>
    </div>
  );
};
