import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as ConfigmapModel from '@/models/Configmap';
import * as UserModel from '@/models/User';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table, notification } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { userOperations } from '@/store/ducks/user';
import { clusterOperations, clusterActions } from '@/store/ducks/cluster';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { find } from 'lodash';
import * as moment from 'moment';
import * as styles from './styles.module.scss';

import ItemActions from '@/components/ItemActions';

import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);

type ConfigmapProps = OwnProps &
  InjectedAuthRouterProps &
  InjectedIntlProps &
  RouteComponentProps<{ name: string }>;
interface OwnProps {
  configmaps: Array<ConfigmapModel.Configmap>;
  fetchConfigmaps: () => any;
  removeConfigmap: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
  error: Error | null;
  clearClusterError: () => any;
}

interface ConfigmapInfo {
  id: string;
  name: string;
  namespace: string;
  owner: string;
  createdAt: string;
}

class Configmap extends React.Component<ConfigmapProps, object> {
  private columns: Array<ColumnProps<ConfigmapInfo>> = [
    {
      title: <CapitalizedMessage id="name" />,
      dataIndex: 'name',
      width: 300
    },
    {
      title: <CapitalizedMessage id="owner" />,
      dataIndex: 'owner'
    },
    {
      title: <CapitalizedMessage id="namespace" />,
      dataIndex: 'namespace'
    },
    {
      title: <CapitalizedMessage id="createdAt" />,
      dataIndex: 'createdAt'
    },
    {
      title: <CapitalizedMessage id="action" />,
      key: 'action',
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'delete',
              onConfirm: this.handleRemoveConfigmap.bind(this, record.id)
            }
          ]}
        />
      )
    }
  ];
  constructor(props: ConfigmapProps) {
    super(props);
  }

  protected handleRemoveConfigmap = (id: string) => {
    this.props.clearClusterError();
    this.props.removeConfigmap(id);

    const { formatMessage } = this.props.intl;

    if (!this.props.error) {
      notification.success({
        message: formatMessage({
          id: 'action.success'
        }),
        description: formatMessage({
          id: 'configmap.hint.delete.success'
        })
      });
    } else {
      notification.error({
        message: formatMessage({
          id: 'action.failure'
        }),
        description: formatMessage({
          id: 'configmap.hint.delete.failure'
        })
      });
    }
  };

  public componentDidMount() {
    this.props.fetchConfigmaps();
    this.props.fetchUsers();
  }

  protected getConfigmapsInfo = (
    configmaps: Array<ConfigmapModel.Configmap>
  ) => {
    return configmaps.map(configmap => {
      const owner = find(this.props.users, user => {
        return user.id === configmap.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: configmap.id,
        name: configmap.name,
        namespace: configmap.namespace,
        owner: displayName,
        createdAt: moment(configmap.createAt).calendar()
      };
    });
  };

  public render() {
    return (
      <div>
        <Card
          title={<CapitalizedMessage id="configmap" />}
          extra={
            <Link className={styles.action} to="/application/configmap/create">
              <Button>
                <Icon type="plus" /> <FormattedMessage id="configmap.add" />
              </Button>
            </Link>
          }
        >
          <Table
            className="main-table"
            columns={this.columns}
            dataSource={this.getConfigmapsInfo(this.props.configmaps)}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    configmaps: state.cluster.configmaps,
    users: state.user.users,
    error: state.cluster.error
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchConfigmaps: () => dispatch(clusterOperations.fetchConfigmaps()),
  removeConfigmap: (id: string) =>
    dispatch(clusterOperations.removeConfigmap(id)),
  fetchUsers: () => dispatch(userOperations.fetchUsers()),
  clearClusterError: () => dispatch(clusterActions.clearClusterError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Configmap));
