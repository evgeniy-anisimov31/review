import React, { ReactNode } from 'react';
import { Text } from '@consta/uikit/Text';
import { Card, CardProps } from '../../smb_frontend/src/ui/Card/Card';

export type TelemetryCardSimpleProps = {
  loading?: boolean;
  noData?: boolean;
  selected?: boolean;
};

type TelemetryCardProps = {
  title?: string;
  children?: ReactNode;
  showContent?: boolean;
  loading?: boolean;
  actions?: CardProps['actions'];
};

const TelemetryCard: React.FC<TelemetryCardProps> = ({ title, children, showContent = true, loading, actions }) => (
  <Card
    title={
      <Text size='s' view='primary' weight='semibold' lineHeight='s'>
        {title}
      </Text>
    }
    actions={actions}
    loading={loading}
    loaderType='overlay'
    style={{ position: 'relative', height: '100%' }}
  >
    {showContent && children}
  </Card>
);

export default TelemetryCard;
