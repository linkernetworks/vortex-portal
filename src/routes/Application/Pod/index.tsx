import * as React from 'react';
import * as PodModel from '@/models/Pod';
import * as NetworkModel from '@/models/Network';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Tag,
  Drawer,
  Button,
  Tabs,
  Input,
  Select,
  Table,
  notification,
  Popconfirm,
  Card
} from 'antd';
import * as moment from 'moment';
import { ColumnProps } from 'antd/lib/table';
import { filter, includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import * as networkAPI from '@/services/network';
import * as namespaceAPI from '@/services/namespace';

import * as styles from './styles.module.scss';

import PodDrawer from '@/components/PodDrawer';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

interface PodState {
  visiblePodDrawer: boolean;
  visibleModal: boolean;
  currentPod: string;
  networks: Array<NetworkModel.Network>;
  namespaces: Array<NamespaceModel.Namespace>;
  searchType: string;
  searchText: string;
}

type PodProps = OwnProps & InjectedAuthRouterProps;
interface OwnProps {
  pods: PodModel.Pods;
  allPods: Array<string>;
  podsNics: PodModel.PodsNics;
  fetchPods: () => any;
  fetchPodsFromMongo: () => any;
  addPod: (data: PodModel.PodRequest) => any;
  removePod: (id: string) => any;
}

interface PodInfo {
  name: string;
  status: string;
  node: string;
  restarts: number;
  age: string;
}

class Pod extends React.Component<PodProps, PodState> {
  private intervalPodId: number;
  constructor(props: PodProps) {
    super(props);
    this.state = {
      visiblePodDrawer: false,
      visibleModal: false,
      currentPod: '',
      networks: [],
      namespaces: [],
      searchType: 'pod',
      searchText: ''
    };
  }

  public componentDidMount() {
    this.props.fetchPods();
    this.intervalPodId = window.setInterval(this.props.fetchPods, 5000);
    this.props.fetchPodsFromMongo();
  }

  public componentWillUnmount() {
    clearInterval(this.intervalPodId);
  }

  protected showCreate = () => {
    networkAPI.getNetworks().then(res => {
      this.setState({ networks: res.data });
    });
    namespaceAPI.getNamespaces().then(res => {
      this.setState({ namespaces: res.data });
    });
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (podRequest: PodModel.PodRequest) => {
    this.props.addPod(podRequest);
    this.setState({ visibleModal: false });
  };

  protected handleChangeSearchType = (type: string) => {
    this.setState({ searchType: type, searchText: '' });
  };

  protected handleSearch = (e: any) => {
    this.setState({ searchText: e.target.value });
  };

  protected showMorePod = (pod: string) => {
    this.setState({ visiblePodDrawer: true, currentPod: pod });
  };

  protected hideMorePod = () => {
    this.setState({ visiblePodDrawer: false });
  };

  protected getPodInfo = (pods: Array<string>) => {
    return pods.map(pod => ({
      name: this.props.pods[pod].podName,
      namespace: this.props.pods[pod].namespace,
      node: this.props.pods[pod].node,
      status: this.props.pods[pod].status,
      restarts: this.props.pods[pod].restartCount,
      age: moment(this.props.pods[pod].createAt * 1000).fromNow()
    }));
  };

  public render() {
    const { currentPod, searchText } = this.state;
    const filterPods = filter(this.props.allPods, name => {
      switch (this.state.searchType) {
        default:
        case 'pod':
          return includes(this.props.pods[name].podName, searchText);
        case 'container':
          for (const container of this.props.pods[name].containers) {
            if (includes(container, searchText)) {
              return true;
            }
          }
          return false;
        case 'node':
          return includes(this.props.pods[name].node, searchText);
        case 'namespace':
          return includes(this.props.pods[name].namespace, searchText);
      }
    });
    const columns: Array<ColumnProps<PodInfo>> = [
      {
        title: <FormattedMessage id="pod.name" />,
        dataIndex: 'name',
        width: 300
      },
      {
        title: <FormattedMessage id="pod.namespace" />,
        dataIndex: 'namespace'
      },
      {
        title: <FormattedMessage id="pod.node" />,
        dataIndex: 'node'
      },
      {
        title: <FormattedMessage id="pod.status" />,
        dataIndex: 'status'
      },
      {
        title: <FormattedMessage id="pod.age" />,
        dataIndex: 'age'
      },
      {
        title: 'Action',
        render: (_, record) => (
          <a onClick={() => this.showMorePod(record.name)}>More</a>
        )
      }
    ];
    return (
      <div>
        <Card>
          <InputGroup compact={true}>
            <Select
              style={{ width: '15%' }}
              defaultValue="Pod Name"
              onChange={this.handleChangeSearchType}
            >
              <Option value="pod">Pod Name</Option>
              <Option value="container">Container Name</Option>
              <Option value="node">Node Name</Option>
              <Option value="namespace">Namespace</Option>
            </Select>
            <Search
              style={{ width: '20%' }}
              placeholder="Input search text"
              value={this.state.searchText}
              onChange={this.handleSearch}
            />
          </InputGroup>
          <br />
          <Table
            className={styles.table}
            columns={columns}
            dataSource={this.getPodInfo(filterPods)}
            size="small"
          />
          {this.props.pods.hasOwnProperty(currentPod) && (
            <PodDrawer
              pod={this.props.pods[currentPod]}
              podNics={this.props.podsNics[currentPod]}
              visiblePodDrawer={this.state.visiblePodDrawer}
              hideMorePod={this.hideMorePod}
              removePod={this.props.removePod}
            />
          )}

          {/* <Button type="dashed" className={styles.add} onClick={this.showCreate}>
          <Icon type="plus" /> <FormattedMessage id="pod.add" />
        </Button>
        <PodForm
          allPods={this.props.allPods}
          pods={this.props.pods}
          networks={this.state.networks}
          namespaces={this.state.namespaces}
          visible={this.state.visibleModal}
          onCancel={this.hideCreate}
          onSubmit={this.handleSubmit}
        /> */}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  state.cluster.podsFromMongo.forEach(pod => {
    if (state.cluster.pods[pod.name] !== undefined) {
      state.cluster.pods[pod.name].metadata = pod;
    }
  });
  return {
    pods: state.cluster.pods,
    allPods: state.cluster.allPods,
    podsNics: state.cluster.podsNics
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchPods: () => dispatch(clusterOperations.fetchPods()),
  fetchPodsFromMongo: () => dispatch(clusterOperations.fetchPodsFromMongo()),
  addPod: (data: PodModel.PodRequest) => {
    dispatch(clusterOperations.addPod(data));
  },
  removePod: (id: string) => dispatch(clusterOperations.removePod(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pod);
