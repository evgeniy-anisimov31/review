import React from 'react';
import cn from 'classnames';
import styles from '@/components/Constructor/WidgetContainer/WidgetContainer.module.scss';
import { Text } from '@consta/uikit/Text';
import { IconAlert } from '@consta/uikit/IconAlert';

export const AlertFlight = () => {
  return (
    <div className={cn(styles.card, styles.height)}>
      <Text size='s' weight='bold' type='h3'>
        Скорость рейсов
      </Text>
      <Text size='s'>
        Этот способ представления статистических данных в графическом виде демонстрирует вклад отдельных элементов в
        общую сумму
      </Text>
      <div className={cn(styles.card, styles.center, styles.height)}>
        <IconAlert size='m' view='alert' />
        <Text size='s'>Данный виджет может отображать данные</Text>
        <Text size='s' weight='bold'>
          только для одной скважины
        </Text>
      </div>
    </div>
  );
};
