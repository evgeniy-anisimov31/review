import React, { FC, useCallback, useMemo } from 'react';
import { Text } from '@consta/uikit/Text';
import cn from 'classnames';
import { useForm, useFormState } from 'react-final-form';

import {
  dualAxesDataTypeItems,
  getDataItems,
  getDataTypeItems,
  objectItems,
  xAxisItems,
} from '@/components/Constructor/WidgetConfiguration/selectOptions';
import { EPenetrationType, EWidgetDataKind } from '@/types/dataTypes';
import { TWidget } from '@/types/widgetTypes';
import Combobox from '@/components/fields/Combobox/Combobox';
import {
  getChartViewItems,
  getDualChartViewItems,
  getMaxCountObjects,
  getNestedNamesMap,
} from '@/components/Constructor/WidgetConfiguration/utils';
import { WidgetOptionsFieldNames } from '@/constants/names';
import {
  clearableFields,
  disabledObjectLevelTypes,
  disabledTypes,
} from '@/components/Constructor/WidgetConfiguration/constants';
import {
  DatasetNumber,
  FieldItem,
  FieldsRendererProps,
  KeyofDataItems,
  WarningTextRendererProps,
} from '@/components/Constructor/WidgetConfiguration/types';
import { ComboboxProps as ComboboxComponentProps } from '@consta/uikit/Combobox';

import styles from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationModal.module.scss';
import '@/components/Constructor/WidgetConfiguration/WidgetConfigurationModal.css';

const FirstSetNames = getNestedNamesMap(WidgetOptionsFieldNames, 'options');
const SecondSetNames = getNestedNamesMap(WidgetOptionsFieldNames, 'options.secondOptions');

const WidgetSelectors: FC = () => {
  const formState = useFormState<TWidget>();
  const formValues = formState.values;
  const chartData = formValues?.options?.chartData;
  const type = formValues?.options?.type;
  const chartView = formValues?.options?.chartView;
  const secondChartView = formValues?.options?.secondOptions?.chartView;
  const isTwoDatasets = formValues?.options?.isTwoSetsOfData;
  const byObjects = formValues?.options?.byObjects;
  const inDynamics = formValues?.options?.inDynamics;

  const disabledInterval = useMemo(
    () =>
      !chartView ||
      (disabledTypes.includes(type) && !inDynamics && !byObjects) ||
      chartData === EWidgetDataKind.flights,
    [chartView, chartData],
  );

  const disabledView = useMemo(
    () => !type && !disabledTypes.includes(type) && chartData !== EWidgetDataKind.flights,
    [chartData, type],
  );

  const disabledObjectName = useMemo(
    () => !type && !disabledObjectLevelTypes.includes(type) && chartData !== EWidgetDataKind.flights,
    [chartData, type],
  );

  const oneChartFields: FieldItem[] = useMemo(() => {
    return [
      {
        label: 'Тип данных',
        placeholder: 'Выберите тип данных',
        items: getDataItems(inDynamics, byObjects),
        name: 'chartData',
      },
      {
        label: 'Набор данных',
        placeholder: 'Выберите набор данных',
        items: chartData ? getDataTypeItems(chartData, inDynamics, byObjects) : [],
        name: 'type',
        disabled: !chartData,
      },
      {
        label: 'Вид',
        placeholder: 'Выберите вид',
        items: getChartViewItems(type, inDynamics, byObjects),
        name: 'chartView',
        disabled: disabledView,
      },
      byObjects
        ? {
            label: 'Уровень объектов',
            placeholder: 'Выберите уровень объектов',
            items: objectItems,
            name: 'objectLevel',
            disabled: disabledObjectName,
          }
        : {
            label: 'Интервал (ось Х)',
            placeholder: 'Выберите интервал',
            items: xAxisItems,
            name: 'xAxis',
            disabled: disabledInterval || type === EPenetrationType.penetrationPlanFact,
          },
    ];
  }, [type, chartData, disabledInterval, disabledView, byObjects, inDynamics, disabledObjectName]);

  const getPartOfDatasetSelectors = useCallback(
    (datasetNumber: DatasetNumber, isSwitchNotActive: boolean) => {
      const DatasetNames = datasetNumber ? SecondSetNames : FirstSetNames;
      const options = datasetNumber ? formValues?.options?.secondOptions : formValues?.options;

      const datasetItems = dualAxesDataTypeItems[options?.chartData as KeyofDataItems] || [];
      const chartViewItems = getDualChartViewItems(
        datasetNumber,
        formValues?.options?.chartView,
        formValues?.options?.secondOptions?.chartView,
      );

      const fields: FieldItem[] = [
        {
          label: 'Тип данных',
          placeholder: 'Выберите тип данных',
          items: getDataItems(inDynamics, byObjects),
          name: 'chartData',
          disabled: isSwitchNotActive,
        },
        {
          label: 'Набор данных',
          placeholder: 'Выберите набор данных',
          items: datasetItems,
          name: 'type',
          disabled: isSwitchNotActive,
        },
        {
          label: 'Вид',
          placeholder: 'Выберите вид',
          items: chartViewItems,
          name: 'chartView',
          disabled: isSwitchNotActive,
        },
      ];

      return <FieldRenderer fields={fields} names={DatasetNames} />;
    },
    [formValues?.options],
  );

  if (isTwoDatasets) {
    const isSwitchNotActive = !byObjects && !inDynamics;

    return (
      <>
        <div className={styles.optionFields}>
          {byObjects ? (
            <Combobox
              placeholder={'Выберите уровень объектов'}
              label={'Уровень объектов'}
              size={'xs' as 's'}
              items={objectItems}
              name={FirstSetNames.objectLevel}
              disabled={isSwitchNotActive}
            />
          ) : (
            <Combobox
              placeholder={'Выберите интервал'}
              label={'Интервал (ось Х)'}
              size={'xs' as 's'}
              items={xAxisItems}
              name={FirstSetNames.xAxis}
              disabled={isSwitchNotActive}
            />
          )}
        </div>
        <Text className={styles.title} weight='bold' size='s'>
          Данные 1
        </Text>
        {getPartOfDatasetSelectors(DatasetNumber.First, isSwitchNotActive)}
        <WarningTextRenderer byObjects={byObjects} chartView={chartView} />
        <Text className={styles.title} weight='bold' size='s'>
          Данные 2
        </Text>
        {getPartOfDatasetSelectors(DatasetNumber.Second, isSwitchNotActive)}
        <WarningTextRenderer byObjects={byObjects} chartView={secondChartView} />
      </>
    );
  }

  return <FieldRenderer fields={oneChartFields} names={FirstSetNames} />;
};

const WarningTextRenderer: FC<WarningTextRendererProps> = ({ byObjects, chartView }) => {
  if (byObjects && chartView) {
    return (
      <Text className={styles.warningFooter} size={'xs'} view={'warning'}>
        Для данного вида диаграммы можно будет выбрать не более {getMaxCountObjects(chartView)} объектов
      </Text>
    );
  }
  return null;
};

const FieldRenderer: FC<FieldsRendererProps> = ({ fields, names }) => {
  const form = useForm();
  const formState = useFormState<TWidget>();
  const options = formState.values.options;
  const byObjects = options?.byObjects;
  const chartView = options?.chartView;
  const isTwoSetsOfData = options?.isTwoSetsOfData;

  const additionalOnChangeGetter = useCallback(
    (entryName: string, fieldName: string): ComboboxComponentProps['onChange'] =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      () => {
        const index = clearableFields.findIndex((field) => entryName === field);
        if (index >= 0) {
          const parentName = fieldName.replace(entryName, '');

          clearableFields.slice(index + 1).forEach((field) => {
            form.change(`${parentName}${field}`, undefined);
          });
        }
      },
    [form],
  );

  return (
    <>
      <div
        className={cn(styles.optionFields, {
          [styles.optionMargin]: !byObjects,
        })}
      >
        {fields.map((field) => {
          const fieldName = names[field.name];

          return (
            <Combobox
              test-id={field.name}
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              // Типы Consta не знают, что Combobox имеет размер xs
              size={'xs' as 's'}
              items={field.items}
              name={names[field.name]}
              disabled={field.disabled}
              additionalOnChange={additionalOnChangeGetter(field.name, fieldName)}
            />
          );
        })}
      </div>
      {!isTwoSetsOfData && <WarningTextRenderer byObjects={byObjects} chartView={chartView} />}
    </>
  );
};

export default WidgetSelectors;
