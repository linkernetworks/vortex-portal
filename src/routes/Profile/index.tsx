import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Table, Icon, Avatar } from 'antd';
import { InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { userOperations } from '@/store/ducks/user';
import * as styles from './styles.module.scss';
import PasswordForm from '@/components/PasswordForm';
import user from '@/assets/user.svg';

import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { FlattenUser, User } from '@/models/User';
import { userModels } from '@/store/ducks/user';

type UsersProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps extends ColumnProps<FlattenUser> {
  user: User;
  changePassword: (data: userModels.LoginCredential) => any;
}

interface UserState {
  visibleModal: boolean;
}

class Profile extends React.PureComponent<UsersProps, UserState> {
  constructor(props: UsersProps) {
    super(props);
    this.state = {
      visibleModal: false
    };
  }

  private columns = [
    {
      dataIndex: 'key'
    },
    {
      dataIndex: 'value'
    }
  ];
  private data = [
    {
      key: 'User Name',
      value: this.props.user.loginCredential.username
    },
    {
      key: 'Role',
      value: this.props.user.role
    },
    {
      key: 'First Name',
      value: this.props.user.firstName
    },
    {
      key: 'Last Name',
      value: this.props.user.lastName
    },
    {
      key: 'Phone Number',
      value: this.props.user.phoneNumber
    }
  ];

  protected showCreate = () => {
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (data: userModels.LoginCredential) => {
    this.props.changePassword(data);
    this.setState({ visibleModal: false });
  };

  public render() {
    const { Meta } = Card;

    return (
      <div className={styles.test}>
        <Card
          style={{ width: 500 }}
          actions={[<Icon key="edit" type="edit" onClick={this.showCreate} />]}
        >
          <Meta
            avatar={<Avatar src={user} />}
            title={this.props.user.displayName}
            description={
              <Table
                rowKey="name"
                columns={this.columns}
                dataSource={this.data}
                pagination={false}
                showHeader={false}
              />
            }
          />
        </Card>
        <PasswordForm
          username={this.props.user.loginCredential.username}
          visible={this.state.visibleModal}
          onCancel={this.hideCreate}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.auth.user as User
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  changePassword: (data: userModels.LoginCredential) => {
    dispatch(userOperations.changePassword(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
