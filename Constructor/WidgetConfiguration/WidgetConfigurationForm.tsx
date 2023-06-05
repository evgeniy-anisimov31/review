import React, { FC, useCallback, useMemo } from 'react';
import styles from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationModal.module.scss';
import TextInput from '@/components/fields/TextInput/TextInput';
import { combineValidators, isMaxLength, isRequired } from '@/utils/validate/validate';
import { WidgetFieldNames } from '@/constants/names';
import Switch from '@/components/fields/Switch/Switch';
import WidgetSelectors from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationSelectors';
import { useForm, useFormState } from 'react-final-form';
import { WidgetConfigurationFormProps } from '@/components/Constructor/WidgetConfiguration/types';
import { TWidget } from '@/types/widgetTypes';
import { Text } from '@consta/uikit/Text';

const WIDGET_NAME_MAX_LENGTH = 50;
const WIDGET_DESCRIPTION_MAX_LENGTH = 100;

const isNameMaxLength = isMaxLength(WIDGET_NAME_MAX_LENGTH);
const isDescriptionMaxLength = isMaxLength(WIDGET_DESCRIPTION_MAX_LENGTH);
const isWidgetRequired = isRequired();

const WidgetConfigurationForm: FC<WidgetConfigurationFormProps> = ({ initialValues }) => {
  const form = useForm<TWidget>();
  const formState = useFormState<TWidget>();
  const formValues = formState.values;

  const switchChangeHandler = useCallback(
    (checked, key: string, disabledKey = '') => {
      const state = form.getState();
      // Сбрасываем все значения только при вкл/откл isTwoSetsOfData
      const changedOptions =
        key === 'isTwoSetsOfData'
          ? initialValues.options
          : {
              ...initialValues.options,
              isTwoSetsOfData: state.values.options?.isTwoSetsOfData,
            };

      const refreshedValues = {
        ...state.values,
        options: {
          ...changedOptions,
          [key]: checked,
          [disabledKey]: false,
        },
      };

      form.initialize(refreshedValues);
    },
    [form, initialValues],
  );

  // Применяется только для графика с двумя шкалами
  const isSwitchNotActive = useMemo(
    () => formValues?.options?.isTwoSetsOfData && !formValues?.options?.byObjects && !formValues?.options?.inDynamics,
    [formValues?.options],
  );

  return (
    <div>
      <div className={styles.margin}>
        <TextInput
          test-id={'widgetName'}
          width={'full'}
          validate={combineValidators(isWidgetRequired, isNameMaxLength)}
          placeholder={'Укажите название'}
          className={styles.margin}
          size={'xs'}
          label={'Название и описание виджета'}
          name={WidgetFieldNames.name}
        />
        <TextInput
          test-id={'description'}
          type={'textarea'}
          rows={3}
          width={'full'}
          validate={isDescriptionMaxLength}
          placeholder={'Укажите описание'}
          size={'xs'}
          name={WidgetFieldNames.description}
        />
      </div>
      <Switch
        test-id={'dualGr'}
        additionalOnChange={(value) => switchChangeHandler(value?.checked, 'isTwoSetsOfData')}
        className={styles.switcher}
        label={'График с двумя наборами данных'}
        size={'s'}
        name={`options.${WidgetFieldNames.isTwoSetsOfData}`}
      />
      <div className={styles.switcherGroup}>
        <Text weight='bold' size='s'>
          В динамике/по объектам
        </Text>
        <Text className={styles.warningText} view={'warning'} size={'xs'}>
          {isSwitchNotActive && 'Выберите один из переключателей'}
        </Text>
        <Switch
          test-id={'dynamic'}
          additionalOnChange={(value) => switchChangeHandler(value?.checked, 'inDynamics', 'byObjects')}
          className={styles.margin}
          label={'В динамике'}
          size={'s'}
          name={`options.${WidgetFieldNames.inDynamics}`}
        />
        <Switch
          test-id={'byObject'}
          additionalOnChange={(value) => switchChangeHandler(value?.checked, 'byObjects', 'inDynamics')}
          label={'По объектам'}
          size={'s'}
          name={`options.${WidgetFieldNames.byObjects}`}
        />
      </div>
      <WidgetSelectors />
    </div>
  );
};

export default WidgetConfigurationForm;
