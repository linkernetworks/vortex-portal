import * as React from 'react';
import { Link } from 'react-router-dom';
import * as DeploymentModel from '@/models/Deployment';
import * as ContainerModel from '@/models/Container';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Tag,
  Drawer,
  Button,
  Icon,
  Tabs,
  Input,
  Select,
  Table
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { filter, includes } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as containerAPI from '@/services/container';
import * as networkAPI from '@/services/network';
import * as namespaceAPI from '@/services/namespace';

import * as styles from './styles.module.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

interface DeploymentState {
  visibleDeploymentDrawer: boolean;
  visibleContainerDrawer: boolean;
  visibleModal: boolean;
  currentDeployment: string;
  currentContainer: ContainerModel.Container;
  searchType: string;
  searchText: string;
}

interface DeploymentProps {
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
          pod: '',
          namespace: '',
          node: '',
          image: '',
          command: []
        },
        status: {
          status: '',
          waitingReason: '',
          terminatedReason: '',
          restartTime: ''
        },
        resource: {
          cpuUsagePercentage: [],
          memoryUsageBytes: []
        }
      } as ContainerModel.Container,
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
        title: <FormattedMessage id="deployment.type" />,
        dataIndex: 'type'
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
        size="middle"
      />
    );
  };

  public render() {
    return (
      <div>
        {this.renderTable()}
        <Link className={styles.action} to="/application/deployment/create">
          <Button type="dashed" className={styles.add}>
            <Icon type="plus" /> <FormattedMessage id="deployment.add" />
          </Button>
        </Link>
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
