import * as React from 'react';
import { Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

import * as styles from './styles.module.scss';

interface ItemActionProps {
  type: string;
  disable?: boolean;
  onConfirm?: () => any;
}

const ItemAction: React.SFC<ItemActionProps> = props => {
  const { type, disable } = props;
  return disable ? (
    <a href="javascript:;" className={styles.disabled}>
      <FormattedMessage id={`action.${type}`} />
    </a>
  ) : (
    <Popconfirm
      key={`action.${type}`}
      title={
        <FormattedMessage
          id={`action.confirmTo${type.charAt(0).toUpperCase() + type.slice(1)}`}
        />
      }
      onConfirm={props.onConfirm}
    >
      <a href="javascript:;">
        <FormattedMessage id={`action.${type}`} />
      </a>
    </Popconfirm>
  );
};

export default ItemAction;
