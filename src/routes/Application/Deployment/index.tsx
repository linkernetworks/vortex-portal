import * as React from 'react';
import { Link } from 'react-router-dom';
import * as DeploymentModel from '@/models/Deployment';
import * as ContainerModel from '@/models/Container';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';

interface DeploymentState {
  visibleDeploymentDrawer: boolean;
  visibleContainerDrawer: boolean;
  visibleModal: boolean;
  currentDeployment: string;
  currentContainer: ContainerModel.Container;
  searchType: string;
  searchText: string;
}

type DeploymentProps = OwnProps & InjectedAuthRouterProps;
interface OwnProps {
  deployments: DeploymentModel.Controllers;
  allDeployments: Array<string>;
  fetchDeployments: () => any;
}

interface DeploymentInfo {
  name: string;
  type: string;
  namespace: string;
  desiredPod: number;
  currentPod: number;
  availablePod: number;
  age: string;
}

class Deployment extends React.Component<DeploymentProps, DeploymentState> {
  constructor(props: DeploymentProps) {
    super(props);
    this.state = {
      visibleDeploymentDrawer: false,
      visibleContainerDrawer: false,
      visibleModal: false,
      currentDeployment: '',
      currentContainer: {
        detail: {
          containerName: '',
          createAt: 0,
          status: '',
          restartCount: '',
          pod: '',
          namespace: '',
          node: '',
          image: '',
          command: []
        },
        resource: {
          cpuUsagePercentage: [],
          memoryUsageBytes: []
        }
      },
      searchType: 'deployment',
      searchText: ''
    };
  }

  public componentDidMount() {
    this.props.fetchDeployments();
  }

  protected getDeploymentInfo = (allDeployments: Array<string>) => {
    const { deployments } = this.props;
    return allDeployments.map(deployment => ({
      name: deployments[deployment].controllerName,
      type: deployments[deployment].type,
      namespace: deployments[deployment].namespace,
      desiredPod: deployments[deployment].desiredPod,
      currentPod: deployments[deployment].currentPod,
      availablePod: deployments[deployment].availablePod,
      age: moment(deployments[deployment].createAt * 1000).fromNow()
    }));
  };

  public renderTable = () => {
    const columns: Array<ColumnProps<DeploymentInfo>> = [
      {
        title: <FormattedMessage id="deployment.name" />,
        dataIndex: 'name',
        width: 300
      },
      {
        title: <FormattedMessage id="deployment.namespace" />,
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
        title: <FormattedMessage id="deployment.age" />,
        dataIndex: 'age'
      },
      {
        title: 'Action',
        render: (_, record) => <a>More</a>
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

  public render() {
    return (
      <div>
        <Card title="Deployment">
          {this.renderTable()}
          <Link className={styles.action} to="/application/deployment/create">
            <Button type="dashed" className={styles.add}>
              <Icon type="plus" /> <FormattedMessage id="deployment.add" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    deployments: state.cluster.deployments,
    allDeployments: state.cluster.allDeployments
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchDeployments: () => dispatch(clusterOperations.fetchDeployments())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deployment);
