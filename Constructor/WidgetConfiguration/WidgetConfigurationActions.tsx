import React, { FC, useMemo } from 'react';
import { WidgetConfigurationActionsProps } from '@/components/Constructor/WidgetConfiguration/types';
import styles from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationModal.module.scss';
import { Button } from '@consta/uikit/Button';
import { dataWithAllKindsView } from '@/components/Constructor/WidgetConfiguration/constants';
import { ENPVType, EPenetrationType } from '@/types/dataTypes';

const WidgetConfigurationActions: FC<WidgetConfigurationActionsProps> = ({ values, onClose }) => {
  const disabledAddButton = useMemo(() => {
    const options = values?.options;
    const type = options?.type as EPenetrationType | ENPVType;

    const disabled =
      !values.name ||
      !options?.chartView ||
      !options.chartData ||
      (!options.xAxis && !options.objectLevel && !dataWithAllKindsView.includes(type)) ||
      (!options.objectLevel && options?.byObjects && dataWithAllKindsView.includes(type)) ||
      (!options.xAxis && options?.inDynamics && dataWithAllKindsView.includes(type));

    if (options?.isTwoSetsOfData) {
      return (
        disabled ||
        !options?.secondOptions?.chartView ||
        !options?.secondOptions?.type ||
        !options?.secondOptions?.chartData
      );
    }

    return disabled;
  }, [values]);

  return (
    <div className={styles.buttons}>
      <Button className={styles.cancel} size='s' view='secondary' label='Отменить' onClick={onClose} />
      <Button disabled={disabledAddButton} type={'submit'} size={'s'} view={'primary'} label={'Добавить'} />
    </div>
  );
};

export default WidgetConfigurationActions;
