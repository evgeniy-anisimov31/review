import React, { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@consta/uikit/Text';

import { createWidget, setWidgetModalState, updateWidget } from '@/store/widgets/widgetsSlice';
import { selectDashboards, selectWidgets } from '@/store/selectors';
import { useAuth } from '@/auth/AuthContext/AuthContext';
import styles from './WidgetConfigurationModal.module.scss';
import { widgetTemplate } from '@/const';
import { TWidget } from '@/types/widgetTypes';
import ModalForm from '@/components/ModalForm/ModalForm';
import { useParams } from 'react-router-dom';
import { DashboardParams } from '@/types/dashboardTypes';
import { ActionsRenderFunction } from '@/components/Modal/types';
import WidgetConfigurationActions
  from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationActions';
import WidgetConfigurationForm from '@/components/Constructor/WidgetConfiguration/WidgetConfigurationForm';

type TWidgetConfiguration = {
  onRemoveWidget: (id: number) => void;
};

const WidgetConfigurationModal: FC<TWidgetConfiguration> = ({ onRemoveWidget }) => {
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const params = useParams<DashboardParams>();

  const { data: dashboardData } = useSelector(selectDashboards);
  const { isNew, widgetData } = useSelector(selectWidgets).widgetModalState;

  const dashboardById = useMemo(() => {
    return dashboardData?.find((dashboard) => dashboard.id === Number(params.id));
  }, [params.id]);

  const onClose = useCallback(() => dispatch(setWidgetModalState({ isNew: false, widgetData: null })), []);

  const onCancel = useCallback((id?: number) => () => {
    if (isNew && id) {
      onRemoveWidget(id);
    }
    onClose();
  }, [onClose, onRemoveWidget, isNew]);

  const onSubmit = useCallback((values: TWidget) => {
    if (userData.uid) {
      isNew
        ? dashboardById && dispatch(createWidget(dashboardById, values))
        : dispatch(updateWidget(values));
    }
  }, [userData.uid, isNew, dashboardById]);

  const modalFormActions: ActionsRenderFunction<TWidget> = useCallback((props) => {
    return <WidgetConfigurationActions {...props} />
  }, []);

  return (
    <ModalForm<TWidget>
      title={isNew && <Text>Новый виджет</Text>}
      onSubmit={onSubmit}
      onClose={onCancel()}
      className={styles.container}
      isOpen={Boolean(widgetData)}
      onEsc={onClose}
      initialValues={widgetData || widgetTemplate}
      actions={modalFormActions}
      actionsClassName={styles.actions}
    >
      <WidgetConfigurationForm initialValues={widgetTemplate} />
    </ModalForm>
  );
};

export default memo(WidgetConfigurationModal);
