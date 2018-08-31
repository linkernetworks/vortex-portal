import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Popconfirm } from 'antd';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { FlattenUser } from '@/models/User';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { userOperations, userSelectors } from '@/store/ducks/user';

import * as styles from './styles.module.scss';

type UsersProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps extends ColumnProps<FlattenUser> {
  users: {
    data: Array<FlattenUser>;
    isLoading: boolean;
    error: Error | null;
  };
  fetchUsers: () => any;
  removeUser: (id: string) => any;
}

class Users extends React.PureComponent<UsersProps, object> {
  private columns: Array<ColumnProps<FlattenUser>> = [
    {
      title: this.props.intl.formatMessage({ id: 'user.username' }),
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: this.props.intl.formatMessage({ id: 'user.displayName' }),
      dataIndex: 'displayName',
      key: 'displayName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'user.firstName' }),
      dataIndex: 'firstName',
      key: 'firstName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'user.lastName' }),
      dataIndex: 'lastName',
      key: 'lastName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'user.role' }),
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: this.props.intl.formatMessage({ id: 'user.phoneNumber' }),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: this.props.intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).calendar()
    },
    {
      title: this.props.intl.formatMessage({ id: 'action' }),
      render: (_, record) => {
        return (
          <Popconfirm
            title={<FormattedMessage id="action.confirmToDelete" />}
            onConfirm={this.handleItemDelete.bind(this, record.id)}
          >
            <a href="javascript:;">
              <FormattedMessage id="action.delete" />
            </a>
          </Popconfirm>
        );
      }
    }
  ];

  public componentDidMount() {
    this.props.fetchUsers();
  }

  protected handleItemDelete = (id: string) => {
    this.props.removeUser(id);
  };

  public render() {
    const { users } = this.props;
    return (
      <div>
        <Table
          className={styles.table}
          rowKey="id"
          columns={this.columns}
          dataSource={users.data}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    users: {
      data: userSelectors.flatUsers(state.user),
      isLoading: state.user.isLoading,
      error: state.user.error
    }
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => {
  return {
    fetchUsers: () => dispatch(userOperations.fetchUsers()),
    removeUser: (id: string) => dispatch(userOperations.removeUser(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Users));
