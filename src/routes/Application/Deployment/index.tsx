import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Icon, Table, Drawer, Card } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { find } from 'lodash';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import * as UserModel from '@/models/User';
import * as PodModel from '@/models/Pod';
import * as DeploymentModel from '@/models/Deployment';
import { RootState, RTDispatch, RootAction } from '@/store/ducks';
import { clusterOperations, clusterSelectors } from '@/store/ducks/cluster';
import { userOperations } from '@/store/ducks/user';
import ItemActions from '@/components/ItemActions';
import DeploymentDetail from '@/components/DeploymentDetail';

import * as styles from './styles.module.scss';

type DeploymentProps = OwnProps &
  InjectedAuthRouterProps &
  RouteComponentProps<{ name: string }>;

interface OwnProps {
  pods: PodModel.Pods;
  podsNics: PodModel.PodsNics;
  fetchPods: () => any;
  removePodByName: (namespace: string, id: string) => any;
  deployments: DeploymentModel.Controllers;
  allDeployments: Array<string>;
  fetchDeployments: () => any;
  fetchDeploymentsFromMongo: () => any;
  removeDeployment: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
  push: (path: string) => any;
}

interface DeploymentInfo {
  id: string;
  name: string;
  type: string;
  owner: string;
  namespace: string;
  desiredPod: number;
  currentPod: number;
  availablePod: number;
  createdAt: string;
}

class Deployment extends React.PureComponent<DeploymentProps, object> {
  private intervalPodId: number;
  private columns: Array<ColumnProps<DeploymentInfo>> = [
    {
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      width: 300
    },
    {
      title: <FormattedMessage id="deployment.owner" />,
      dataIndex: 'owner'
    },
    {
      title: <FormattedMessage id="namespace" />,
      dataIndex: 'namespace'
    },
    {
      title: <FormattedMessage id="deployment.desiredPod" />,
      dataIndex: 'desiredPod'
    },
    {
      title: <FormattedMessage id="deployment.currentPod" />,
      dataIndex: 'currentPod'
    },
    {
      title: <FormattedMessage id="deployment.availablePod" />,
      dataIndex: 'availablePod'
    },
    {
      title: <FormattedMessage id="createdAt" />,
      dataIndex: 'createdAt'
    },
    {
      title: <FormattedMessage id="action" />,
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'link',
              path: `/application/deployment/${record.name}`
            }
          ]}
        />
      )
    }
  ];

  public componentDidMount() {
    this.intervalPodId = window.setInterval(this.props.fetchPods, 5000);
    this.props.fetchPods();
    this.props.fetchDeployments();
    this.props.fetchDeploymentsFromMongo();
    this.props.fetchUsers();
  }

  public componentWillUnmount() {
    clearInterval(this.intervalPodId);
  }

  protected showMorePod = (pod: string) => {
    this.setState({ visiblePodDrawer: true, currentPod: pod });
  };

  protected hideMorePod = () => {
    this.setState({ visiblePodDrawer: false });
  };

  protected getDeploymentInfo = (allDeployments: Array<string>) => {
    const { deployments } = this.props;
    return allDeployments.map(deployment => {
      const owner = find(this.props.users, user => {
        return user.id === deployments[deployment].ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: deployments[deployment].id,
        name: deployments[deployment].controllerName,
        owner: displayName,
        type: deployments[deployment].type,
        namespace: deployments[deployment].namespace,
        desiredPod: deployments[deployment].desiredPod,
        currentPod: deployments[deployment].currentPod,
        availablePod: deployments[deployment].availablePod,
        createdAt: moment(deployments[deployment].createAt * 1000).fromNow()
      };
    });
  };

  public render() {
    const { deployments, pods, match } = this.props;
    const currentDeployment = match.params.name;
    const visibleDeploymentDrawer = !!currentDeployment;

    return (
      <div>
        <Card
          title={<FormattedMessage id="deployment" />}
          extra={
            <Link className={styles.action} to="/application/deployment/create">
              <Button>
                <Icon type="plus" /> <FormattedMessage id="deployment.add" />
              </Button>
            </Link>
          }
        >
          <Table
            className="main-table"
            rowKey="id"
            columns={this.columns}
            dataSource={this.getDeploymentInfo(this.props.allDeployments)}
          />
          <Drawer
            title={<FormattedMessage id="deployment" />}
            width={720}
            closable={false}
            onClose={this.props.push.bind(this, '/application/deployment')}
            visible={visibleDeploymentDrawer}
          >
            {deployments.hasOwnProperty(currentDeployment) && (
              <DeploymentDetail
                deployment={deployments[currentDeployment]}
                pods={pods}
                removeDeployment={this.props.removeDeployment}
              />
            )}
          </Drawer>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  state.cluster.deploymentsFromMongo.forEach(deployment => {
    if (state.cluster.deployments[deployment.name] !== undefined) {
      state.cluster.deployments[deployment.name].id = deployment.id;
      state.cluster.deployments[deployment.name].ownerID = deployment.ownerID;
    }
  });
  return {
    pods: clusterSelectors.getPodsInAvailableNamespace(state.cluster),
    podsNics: state.cluster.podsNics,
    deployments: clusterSelectors.getDeploymentsInAvailableNamespace(
      state.cluster
    ),
    allDeployments: clusterSelectors.getAllDeploymentsInAvailableNamespace(
      state.cluster
    ),
    users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction> & RTDispatch) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods()),
  removePodByName: (namespace: string, id: string) =>
    dispatch(clusterOperations.removePodByName(namespace, id)),
  fetchDeployments: () => dispatch(clusterOperations.fetchDeployments()),
  fetchDeploymentsFromMongo: () =>
    dispatch(clusterOperations.fetchDeploymentsFromMongo()),
  removeDeployment: (id: string) =>
    dispatch(clusterOperations.removeDeployment(id)),
  fetchUsers: () => dispatch(userOperations.fetchUsers()),
  push: (path: string) => dispatch(push(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deployment);
