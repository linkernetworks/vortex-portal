import * as React from 'react';
import { Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

interface ItemActionProps {
  type: string;
  onConfirm: () => any;
}

const ItemAction: React.SFC<ItemActionProps> = props => {
  const { type } = props;
  return (
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
