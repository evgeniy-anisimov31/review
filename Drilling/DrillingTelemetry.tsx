import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { getTelemetryCalculations } from '../../smb_frontend/src/store/drilling/drillingSlice';
import { DrillingScreen } from 'review/Drilling/DrillingScreen/DrillingScreen';
import { SpoScreen } from 'review/Drilling/SpoScreen/SpoScreen';
import { flattenAssetTree, WELL_TREE_SELECT_DELAY_MS } from '../../smb_frontend/src/utils/drilling/wellTree';
import { SectionSelector } from './SectionSelector/SectionSelector';
import styles from './DrillingTelemetry.module.scss';
import { useAnalyticsHandle } from '../../smb_frontend/src/hooks/analytics/useAnalyticsHandle';
import { Analytics } from '../../smb_frontend/src/constants/names';
import { EAssetTypes } from '../../smb_frontend/src/types/drillingTypes';

const tabs: string[] = ['Бурение', 'СПО'];

const DrillingTelemetry = () => {
  const [tab, setTab] = useState<string | undefined>(tabs[0]);
  const { selectedAssets, selectedSections, depositsData } = useSelector(selectDrilling);
  const flattenAssetsData = useMemo(() => flattenAssetTree(depositsData), [depositsData]);
  const analyticsHandle = useAnalyticsHandle();

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedSections.length === 0) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      isMounted && dispatch(getTelemetryCalculations([...selectedSections]));
    }, WELL_TREE_SELECT_DELAY_MS);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedSections]);

  useEffect(() => {
    if (selectedSections.length > 0) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      isMounted && dispatch(getTelemetryCalculations([...selectedAssets]));
    }, WELL_TREE_SELECT_DELAY_MS);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedAssets, selectedSections]);

  const changeTabHandler = useCallback(({ value }: { value: string }) => {
    if (value === tabs[1]) {
      const wellIds = selectedAssets?.map((item) => item.id) || [];
      const assetWells = flattenAssetsData
        .filter((item) => wellIds.includes(`${item.id}`) && item.type === EAssetTypes.well);
      const clusterIds = assetWells.map((item) => item.clusterId);
      const depositIds = assetWells.map((item) => item.depositId);

      analyticsHandle(Analytics.SPO, {
        well_id: wellIds.join(),
        cluster_id: clusterIds.join(),
        field_id: depositIds.join(),
      });
    }
    setTab(value);
  }, [analyticsHandle, selectedAssets, flattenAssetsData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <div>
          <ChoiceGroup
            value={tab}
            onChange={changeTabHandler}
            items={tabs}
            size='s'
            getLabel={(item) => item}
            multiple={false}
            name='dataScreenToggle'
            view='secondary'
            className={styles.choiceGroup}
          />
        </div>
        <div className={styles.sectionsSelectorContainer}>
          <SectionSelector />
        </div>
      </div>
      <div className={styles.contentContainer}>{tab == tabs[0] ? <DrillingScreen /> : <SpoScreen />}</div>
    </div>
  );
};

export default DrillingTelemetry;
