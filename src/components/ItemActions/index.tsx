import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import * as classnames from 'classnames';
import { get } from 'lodash';
import { Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';

import * as styles from './styles.module.scss';

interface ItemActionProps {
  items: Array<{
    type: string;
    disable?: boolean;
    link?: LinkProps;
    onConfirm?: () => any;
  }>;
}

const needPop = {
  delete: true,
  more: false,
  link: false
};

const ActionLink: React.SFC<{
  type: string;
  disable: boolean;
  onClick?: (e?: React.MouseEvent<any>) => void;
  onMouseEnter?: (e?: React.MouseEvent<any>) => void;
  onMouseLeave?: (e?: React.MouseEvent<any>) => void;
}> = props => (
  <a
    href="javascript:;"
    className={classnames({ [styles.disabled]: props.disable })}
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    <FormattedMessage id={`action.${props.type}`} />
  </a>
);

const ItemActions: React.SFC<ItemActionProps> = props => (
  <React.Fragment>
    {props.items.map((item, index) => {
      const { type, disable = false, onConfirm, link } = item;

      if (type === 'link') {
        return (
          <Link key={index} {...link!}>
            <FormattedMessage id="action.more" />
          </Link>
        );
      }

      if (needPop[type]) {
        return (
          <Popconfirm
            key={index}
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
          <span key={index} onClick={onConfirm}>
            <ActionLink type={type} disable={disable} />
          </span>
        );
      }
    })}
  </React.Fragment>
);

export default ItemActions;
