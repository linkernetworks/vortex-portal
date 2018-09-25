import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Table, Icon, Avatar } from 'antd';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import * as styles from './styles.module.scss';

import { FlattenUser, User } from '@/models/User';
import { RootState } from '@/store/ducks';

type UsersProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps extends ColumnProps<FlattenUser> {
  user: User;
}

interface UserState {
  isCreating: boolean;
}

class Profile extends React.PureComponent<UsersProps, UserState> {
  public readonly state: UserState = {
    isCreating: false
  };

  public render() {
    const { Meta } = Card;
    const columns = [
      {
        title: 'Key',
        dataIndex: 'key'
      },
      {
        title: 'Value',
        dataIndex: 'value'
      }
    ];
    const data = [
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

    return (
      <div className={styles.test}>
        <Card
          style={{ width: 500 }}
          // cover={<div className={styles.billboard} />}
          actions={[<Icon key="edit" type="edit" />]}
        >
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={this.props.user.displayName}
            description={
              <Table
                rowKey="name"
                columns={columns}
                dataSource={data}
                pagination={false}
                showHeader={false}
                size={'middle'}
              />
            }
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.auth.user as User
  };
};

export default connect(mapStateToProps)(injectIntl(Profile));
