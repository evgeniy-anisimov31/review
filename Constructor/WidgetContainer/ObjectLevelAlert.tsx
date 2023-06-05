import React, { FC } from 'react';
import cn from 'classnames';
import styles from '@/components/Constructor/WidgetContainer/WidgetContainer.module.scss';
import { Text } from '@consta/uikit/Text';
import { IconAlert } from '@consta/uikit/IconAlert';

type ObjectLevelAlert = {
  maxCount: string | number;
  selectedCount: string | number;
};

export const ObjectLevelAlert: FC<ObjectLevelAlert> = ({ maxCount, selectedCount }) => {
  return (
    <div className={cn(styles.card, styles.height, styles.text)}>
      <div className={cn(styles.card, styles.center)}>
        <IconAlert size='m' view='alert' />
        <Text size='s'>
          Для выбранного вида диаграммы можно выбрать не более {maxCount} объектов (выбрано {selectedCount}). Измените
          выбор объектов или выберите другой вид диаграммы/уберите отображение по объектам в настройках виджета
        </Text>
      </div>
    </div>
  );
};
