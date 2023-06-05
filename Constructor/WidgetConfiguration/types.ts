import { ComboboxProps } from '@/components/fields/Combobox/types';
import { WidgetOptionsFieldNames } from '@/constants/names';
import { FormState } from 'final-form';
import { TWidget } from '@/types/widgetTypes';
import { EChartType } from '@/types/graphTypes';

export type KeyofDataItems = 'penetration';

export enum DatasetNumber {
  First,
  Second,
}

export type FieldItem = ComboboxProps & { name: keyof typeof WidgetOptionsFieldNames };

export type FieldsRendererProps = { fields: FieldItem[]; names: typeof WidgetOptionsFieldNames };

export type WarningTextRendererProps = { byObjects?: boolean; chartView?: EChartType | null };

export type WidgetConfigurationActionsProps = FormState<TWidget> & { onClose: () => void };

export type WidgetConfigurationFormProps = {
  initialValues: TWidget | Omit<TWidget, 'id'>;
};
