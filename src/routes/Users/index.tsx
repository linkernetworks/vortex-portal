import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Table, Icon } from 'antd';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { FlattenUser, UserBrief, UserFields, User } from '@/models/User';
import ItemActions from '@/components/ItemActions';
import UserForm from '@/components/UserForm';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { userOperations, userSelectors, userActions } from '@/store/ducks/user';

type UsersProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps extends ColumnProps<FlattenUser> {
  users: {
    data: Array<FlattenUser>;
    isLoading: boolean;
    error: Error | null;
  };
  user: User;
  fetchUsers: () => any;
  addUser: (data: UserBrief) => any;
  removeUser: (id: string) => any;
  clearUserError: () => any;
}

interface UserState {
  isCreating: boolean;
}

class Users extends React.PureComponent<UsersProps, UserState> {
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
          <ItemActions
            items={[
              {
                type: 'delete',
                disable: record.id === this.props.user.id,
                onConfirm: this.handleItemDelete.bind(this, record.id)
              }
            ]}
          />
        );
      }
    }
  ];

  public readonly state: UserState = {
    isCreating: false
  };

  public componentDidMount() {
    this.props.fetchUsers();
  }

  protected handleItemDelete = (id: string) => {
    this.props.removeUser(id);
  };

  protected handleFormToggle = () => {
    this.setState({ isCreating: !this.state.isCreating });
  };

  protected handleFormSubmit = (data: UserFields) => {
    const { username, password, ...rest } = data;
    this.props
      .addUser({
        loginCredential: { username, password },
        ...rest
      })
      .then(() => {
        if (!this.props.users.error) {
          this.setState({ isCreating: false });
        }
      });
  };

  public render() {
    const { users, clearUserError } = this.props;
    return (
      <div>
        <Card
          title={<FormattedMessage id="user" />}
          extra={
            <Button onClick={this.handleFormToggle}>
              <Icon type="plus" /> <FormattedMessage id="user.add" />
            </Button>
          }
        >
          <Table
            rowKey="id"
            className="main-table"
            columns={this.columns}
            dataSource={users.data}
          />
          <UserForm
            visiable={this.state.isCreating}
            isLoading={users.isLoading}
            error={users.error}
            onClose={this.handleFormToggle}
            onSubmit={this.handleFormSubmit}
            onCloseError={clearUserError}
          />
        </Card>
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
    },
    user: state.user.auth.user as User
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => {
  return {
    fetchUsers: () => dispatch(userOperations.fetchUsers()),
    addUser: (data: UserBrief) => dispatch(userOperations.addUser(data)),
    removeUser: (id: string) => dispatch(userOperations.removeUser(id)),
    clearUserError: () => dispatch(userActions.clearUserError())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Users));
