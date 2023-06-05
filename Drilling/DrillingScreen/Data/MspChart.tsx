import React, { useMemo, useEffect } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Scatter } from '@consta/charts/Scatter';
import { Modal } from '@consta/uikit/Modal';
import { Button } from '@consta/uikit/Button';
import { IconDownload } from '@consta/uikit/IconDownload';

import { selectDrilling } from '../../smb_frontend/src/store/selectors';
import { downloadMspReportFile } from '../../smb_frontend/src/store/drilling/drillingSlice';
import TelemetryCard from 'review/Drilling/TelemetryCard/TelemetryCard';
import { getDrillingMechanicalPenetrationRate, getMspReportFilename } from '../../smb_frontend/src/utils/drilling/drilling';
import { FileUploadMessage } from '../../smb_frontend/src/utils/drilling/helpers';
import { chartColorsList } from '../../smb_frontend/src/utils/drilling/common';
import { EAssetTypes } from '../../smb_frontend/src/types/drillingTypes';
import styles from '../../DrillingTelemetry.module.scss';

type MspChartProps = {
  loading?: boolean;
  noData?: boolean;
  selected?: boolean;
};

const MspChart: React.FC<MspChartProps> = ({ loading, selected }) => {
  const dispatch = useDispatch();
  const { telemetryData, selectedAssets, isMspReportFileLoading } = useSelector(selectDrilling);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Механическая скорость проходки
  const drillingMechanicalPenetrationRate = useMemo(
    () => getDrillingMechanicalPenetrationRate(telemetryData),
    [telemetryData],
  );

  const showDrillingMechanicalPenetrationRate = selected && drillingMechanicalPenetrationRate?.length > 0;

  const onClickDownload = () => {
    const wellAssets = selectedAssets.filter(({ type }) => type === EAssetTypes.well);
    const filename = getMspReportFilename(wellAssets.map(({ caption }) => caption));
    if (wellAssets.length === 0) return;
    setIsModalOpen(true);
    dispatch(downloadMspReportFile(filename, selectedAssets));
  };

  useEffect(() => {
    if (isModalOpen || !isMspReportFileLoading) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, isMspReportFileLoading]);

  return (
    <TelemetryCard
      title='Механическая скорость проходки, м/ч'
      loading={loading}
      showContent={showDrillingMechanicalPenetrationRate}
      actions={[
        <div key='downloadMspReport'>
          <Button
            label='Выгрузить данные по МСП'
            iconLeft={IconDownload}
            onlyIcon
            className={cn({ [styles.visuallyHidden]: !selected })}
            onClick={() => onClickDownload()}
            size='s'
            view='clear'
            title=''
            loading={isMspReportFileLoading}
          />
        </div>,
      ]}
    >
      <div className={styles.mspChartHeightFix}>
        <Scatter
          data={drillingMechanicalPenetrationRate}
          xField='speed'
          yField='depth'
          size={3}
          xAxis={{
            position: 'top',
            title: {
              text: 'Скорость, м/ч',
            },
          }}
          yAxis={{
            position: 'right',
            top: true,
            nice: true,
            title: {
              text: 'Глубина, м',
            },
          }}
          meta={{
            depth: {
              alias: 'Глубина, м',
              formatter: (v) => Math.abs(v),
            },
            speed: {
              alias: 'Скорость, м/ч',
            },
            srcName: {
              alias: 'Объект',
              formatter: (v) => v,
            },
          }}
          colorField='srcName'
          color={chartColorsList}
          shape='circle'
          animation={false}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        hasOverlay={false}
        onClickOutside={() => setIsModalOpen(false)}
        onEsc={() => setIsModalOpen(false)}
        className={styles.informerModal}
      >
        <div className={styles.centeredAbsolute}>
          <FileUploadMessage />
        </div>
      </Modal>
    </TelemetryCard>
  );
};

export default MspChart;
