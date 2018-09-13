import * as React from 'react';
import * as classnames from 'classnames';
import { Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

import * as styles from './styles.module.scss';

interface ItemActionProps {
  items: Array<{
    type: string;
    disable?: boolean;
    onConfirm?: () => any;
  }>;
}

const needPop = {
  delete: true,
  more: false
};

const ActionLink: React.SFC<{ type: string; disable: boolean }> = props => (
  <a
    href="javascript:;"
    className={classnames({ [styles.disabled]: props.disable })}
  >
    <FormattedMessage id={`action.${props.type}`} />
  </a>
);

const ItemActions: React.SFC<ItemActionProps> = props => (
  <React.Fragment>
    {props.items.map(item => {
      const { type, disable = false, onConfirm } = item;
      if (needPop[type]) {
        return (
          <Popconfirm
            key={`action.${type}`}
            title={
              <FormattedMessage
                id={`action.confirmTo${type.charAt(0).toUpperCase() +
                  type.slice(1)}`}
              />
            }
            onConfirm={onConfirm}
          >
            <ActionLink type={type} disable={disable} />
          </Popconfirm>
        );
      } else {
        return (
          <span key={`action.${type}`} onClick={onConfirm}>
            <ActionLink type={type} disable={disable} />
          </span>
        );
      }
    })}
  </React.Fragment>
);

export default ItemActions;
