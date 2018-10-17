import * as React from 'react';
import { push } from 'react-router-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as ConfigmapModel from '@/models/Configmap';
import * as UserModel from '@/models/User';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table, notification, Drawer } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { find } from 'lodash';
import * as moment from 'moment';
import { clusterOperations, clusterSelectors } from '@/store/ducks/cluster';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import ConfigmapDetail from '@/components/ConfigmapDetail';
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
  allConfigmaps: ConfigmapModel.Configmaps;
  fetchConfigmaps: () => any;
  removeConfigmap: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
  error: Error | null;
  clearClusterError: () => any;
  push: (path: string) => any;
}

interface ConfigmapInfo {
  id: string;
  name: string;
  namespace: string;
  owner: string;
  createdAt: string;
  push: (path: string) => any;
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
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'link',
              link: {
                to: {
                  pathname: `/application/configmap/${record.name}`
                }
              }
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
    const { configmaps, match, allConfigmaps } = this.props;
    const currentConfigmap = match.params.name;
    const visibleConfigmapDrawer = !!currentConfigmap;

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
          <Drawer
            title={<CapitalizedMessage id="configmap" />}
            width={720}
            closable={false}
            onClose={this.props.push.bind(this, '/application/configmap')}
            visible={visibleConfigmapDrawer}
          >
            {allConfigmaps.hasOwnProperty(currentConfigmap) && (
              <ConfigmapDetail
                configmap={allConfigmaps[currentConfigmap]}
                removeConfigmap={this.handleRemoveConfigmap}
              />
            )}
          </Drawer>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    configmaps: state.cluster.configmaps,
    users: state.user.users,
    error: state.cluster.error,
    allConfigmaps: clusterSelectors.getConfigmaps(state.cluster)
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchConfigmaps: () => dispatch(clusterOperations.fetchConfigmaps()),
  removeConfigmap: (id: string) =>
    dispatch(clusterOperations.removeConfigmap(id)),
  push: (path: string) => dispatch(push(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Configmap));
