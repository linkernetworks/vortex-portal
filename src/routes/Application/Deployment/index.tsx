import * as React from 'react';
import { Link } from 'react-router-dom';
import * as DeploymentModel from '@/models/Deployment';
import * as PodModel from '@/models/Pod';
import { connect } from 'react-redux';
import {
  Button,
  Icon,
  Table,
  Drawer,
  Tag,
  notification,
  Popconfirm,
  Card
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';

import PodDrawer from '@/components/PodDrawer';

interface DeploymentState {
  visiblePodDrawer: boolean;
  visibleDeploymentDrawer: boolean;
  visibleModal: boolean;
  currentPod: string;
  currentDeployment: string;
  deletable: boolean;
}

type DeploymentProps = OwnProps & InjectedAuthRouterProps;
interface OwnProps {
  pods: PodModel.Pods;
  podsNics: PodModel.PodsNics;
  fetchPods: () => any;
  removePod: (id: string) => any;
  deployments: DeploymentModel.Controllers;
  allDeployments: Array<string>;
  fetchDeployments: () => any;
  fetchDeploymentsFromMongo: () => any;
  removeDeployment: (id: string) => any;
}

interface PodInfo {
  name: string;
  status: string;
  node: string;
  restarts: number;
  createdAt: string;
}

interface DeploymentInfo {
  name: string;
  type: string;
  namespace: string;
  desiredPod: number;
  currentPod: number;
  availablePod: number;
  createdAt: string;
}

class Deployment extends React.Component<DeploymentProps, DeploymentState> {
  private intervalPodId: number;
  constructor(props: DeploymentProps) {
    super(props);
    this.state = {
      visiblePodDrawer: false,
      visibleDeploymentDrawer: false,
      visibleModal: false,
      currentPod: '',
      currentDeployment: '',
      deletable: true
    };
  }

  public componentDidMount() {
    this.intervalPodId = window.setInterval(this.props.fetchPods, 5000);
    this.props.fetchPods();
    this.props.fetchDeployments();
    this.props.fetchDeploymentsFromMongo();
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

  protected showMoreDeployment = (currentDeployment: string) => {
    this.setState({
      visibleDeploymentDrawer: true,
      currentDeployment
    });
  };

  protected hideMoreDeployment = () => {
    this.setState({ visibleDeploymentDrawer: false });
  };

  protected getDeploymentInfo = (allDeployments: Array<string>) => {
    const { deployments } = this.props;
    return allDeployments.map(deployment => ({
      name: deployments[deployment].controllerName,
      type: deployments[deployment].type,
      namespace: deployments[deployment].namespace,
      desiredPod: deployments[deployment].desiredPod,
      currentPod: deployments[deployment].currentPod,
      availablePod: deployments[deployment].availablePod,
      createdAt: moment(deployments[deployment].createAt * 1000).fromNow()
    }));
  };

  public renderTable = () => {
    const columns: Array<ColumnProps<DeploymentInfo>> = [
      {
        title: <FormattedMessage id="name" />,
        dataIndex: 'name',
        width: 300
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
          <a onClick={() => this.showMoreDeployment(record.name)}>
            {<FormattedMessage id="action.more" />}
          </a>
        )
      }
    ];

    return (
      <Table
        className={styles.table}
        columns={columns}
        dataSource={this.getDeploymentInfo(this.props.allDeployments)}
        size="small"
      />
    );
  };

  protected renderStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'ready':
      case 'Completed':
        return <Icon type="check-circle" className={styles.readyIcon} />;
      case 'ContainerCreating':
        return <Icon type="clock-circle" className={styles.pendIcon} />;
      default:
        return <Icon type="close-circle" className={styles.errorIcon} />;
    }
  };

  protected handleRemoveDeployment = (id: string) => {
    this.setState({ deletable: false });
    this.props.removeDeployment(id);
    return notification.success({
      message: 'Success',
      description: 'Delete the deployment successfully.'
    });
  };

  protected renderListItemContent = (
    title: string | React.ReactNode,
    content: string | React.ReactNode
  ) => {
    return (
      <div className={styles.column}>
        <div className="title">{title}</div>
        <div className="content">{content}</div>
      </div>
    );
  };

  protected renderLabels = (labels: Map<string, string>) => {
    return (
      <div className={styles.labels}>
        {Object.keys(labels).map(key => (
          <Tag color="blue" className={styles.label} key={key}>
            {key} : {labels[key]}
          </Tag>
        ))}
      </div>
    );
  };

  protected getPodInfo = (pods: Array<string>) => {
    if (Object.keys(this.props.pods).length === 0) {
      return [];
    }
    return pods.map(pod => ({
      name: this.props.pods[pod].podName,
      namespace: this.props.pods[pod].namespace,
      node: this.props.pods[pod].node,
      status: this.props.pods[pod].status,
      restarts: this.props.pods[pod].restartCount,
      createdAt: moment(this.props.pods[pod].createAt * 1000).fromNow()
    }));
  };

  protected renderPod = () => {
    const { deployments } = this.props;
    const { currentDeployment } = this.state;
    const columns: Array<ColumnProps<PodInfo>> = [
      {
        title: <FormattedMessage id="name" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="namespace" />,
        dataIndex: 'namespace'
      },
      {
        title: <FormattedMessage id="node" />,
        dataIndex: 'node'
      },
      {
        title: <FormattedMessage id="status" />,
        dataIndex: 'status'
      },
      {
        title: <FormattedMessage id="action" />,
        key: 'action',
        render: (_, record) => (
          <a onClick={() => this.showMorePod(record.name)}>More</a>
        )
      }
    ];
    return (
      <Table
        size="middle"
        columns={columns}
        dataSource={this.getPodInfo(deployments[currentDeployment].pods)}
        pagination={false}
      />
    );
  };

  protected renderAction = (id: string | undefined) => {
    if (!!id && this.state.deletable === true) {
      return (
        <Popconfirm
          key="action.delete"
          title={<FormattedMessage id="action.confirmToDelete" />}
          onConfirm={this.handleRemoveDeployment.bind(this, id)}
        >
          <Button>
            <Icon type="delete" /> <FormattedMessage id="deployment.delete" />
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button type="dashed" disabled={true}>
          <Icon type="delete" />
          <FormattedMessage id="deployment.undeletable" />
        </Button>
      );
    }
  };

  public render() {
    const { deployments, pods, podsNics } = this.props;
    const { currentDeployment, currentPod } = this.state;
    return (
      <div>
        <Card title={<FormattedMessage id="deployment" />}>
          {this.renderTable()}
          <Link className={styles.action} to="/application/deployment/create">
            <Button type="dashed" className={styles.add}>
              <Icon type="plus" /> <FormattedMessage id="deployment.add" />
            </Button>
          </Link>
          {deployments.hasOwnProperty(currentDeployment) && (
            <Drawer
              title={<FormattedMessage id="deployment" />}
              width={720}
              closable={false}
              onClose={this.hideMoreDeployment}
              visible={this.state.visibleDeploymentDrawer}
            >
              <div className={styles.contentSection}>
                <h2 style={{ display: 'inline' }}>
                  {deployments[currentDeployment].controllerName}
                </h2>
                {this.renderStatusIcon('running')}
              </div>

              <div className={styles.contentSection}>
                <h3>Labels</h3>
                {this.renderListItemContent(
                  <FormattedMessage id="deployment.labels" />,
                  this.renderLabels(deployments[currentDeployment].labels)
                )}
              </div>

              <div className={styles.contentSection}>
                <h3>Pods</h3>
                {this.renderPod()}
              </div>

              <PodDrawer
                pod={pods[currentPod]}
                podNics={podsNics[currentPod]}
                visiblePodDrawer={this.state.visiblePodDrawer}
                hideMorePod={this.hideMorePod}
                removePod={this.props.removePod}
              />
              <div className={styles.drawerBottom}>
                {this.renderAction(deployments[currentDeployment].id)}
              </div>
            </Drawer>
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  state.cluster.deploymentsFromMongo.forEach(deployment => {
    if (state.cluster.deployments[deployment.name] !== undefined) {
      state.cluster.deployments[deployment.name].id = deployment.id;
    }
  });
  return {
    pods: state.cluster.pods,
    podsNics: state.cluster.podsNics,
    deployments: state.cluster.deployments,
    allDeployments: state.cluster.allDeployments
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods()),
  removePod: (id: string) => dispatch(clusterOperations.removePod(id)),
  fetchDeployments: () => dispatch(clusterOperations.fetchDeployments()),
  fetchDeploymentsFromMongo: () =>
    dispatch(clusterOperations.fetchDeploymentsFromMongo()),
  removeDeployment: (id: string) =>
    dispatch(clusterOperations.removeDeployment(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deployment);
