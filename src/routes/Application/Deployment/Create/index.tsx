import * as React from 'react';
import * as DeploymentModel from '@/models/Deployment';
import * as ContainerModel from '@/models/Container';
import * as NamespaceModel from '@/models/Namespace';
import { networkModels, networkOperations } from '@/store/ducks/network';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
  Table,
  Card
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

import DeploymentForm from '@/components/DeploymentForm';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

interface CreateDeploymentState {
  tabKey: string;
}

interface CreateDeploymentProps {
  deployments: DeploymentModel.Controllers;
  allDeployments: Array<string>;
  containers: ContainerModel.Containers;
  allContainers: Array<string>;
  networks: Array<networkModels.Network>;
  namespaces: Array<NamespaceModel.Namespace>;
  fetchDeployments: () => any;
  fetchContainers: () => any;
  fetchNetworks: () => any;
  fetchNamespaces: () => any;
  addDeployment: (data: DeploymentModel.Deployment) => any;
  push: (route: string) => any;
}

const tabList = [
  {
    key: 'addDeployment',
    tab: <FormattedMessage id="deployment.add" />
  },
  {
    key: 'addDeploymentWithNetwork',
    tab: <FormattedMessage id="deployment.addWithNetwork" />
  }
];

class CreateDeployment extends React.Component<
  CreateDeploymentProps,
  CreateDeploymentState
> {
  constructor(props: CreateDeploymentProps) {
    super(props);
    this.state = {
      tabKey: 'addDeployment'
    };
  }
  public componentDidMount() {
    this.props.fetchDeployments();
    this.props.fetchContainers();
    this.props.fetchNetworks();
    this.props.fetchNamespaces();
  }

  protected handleSubmit = (deployment: DeploymentModel.Deployment) => {
    this.props.addDeployment(deployment);
    this.props.push('/application/deployment');
  };

  public renderTabContent = () => {
    const { tabKey } = this.state;

    switch (tabKey) {
      case 'addDeployment':
        return (
          <DeploymentForm
            key={tabKey}
            deployments={this.props.deployments}
            allDeployments={this.props.allDeployments}
            containers={this.props.containers}
            allContainers={this.props.allContainers}
            network={false}
            networks={this.props.networks}
            namespaces={this.props.namespaces}
            onSubmit={this.handleSubmit}
          />
        );
      case 'addDeploymentWithNetwork':
        return (
          <DeploymentForm
            key={tabKey}
            deployments={this.props.deployments}
            allDeployments={this.props.allDeployments}
            containers={this.props.containers}
            allContainers={this.props.allContainers}
            network={true}
            networks={this.props.networks}
            namespaces={this.props.namespaces}
            onSubmit={this.handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  public render() {
    const { tabKey } = this.state;

    return (
      <Card
        className={styles.card}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.setState({ tabKey: key });
        }}
      >
        {this.renderTabContent()}
      </Card>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    deployments: state.cluster.deployments,
    allDeployments: state.cluster.allDeployments,
    containers: state.cluster.containers,
    allContainers: state.cluster.allContainers,
    networks: state.network.networks,
    namespaces: state.cluster.namespaces
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchDeployments: () => dispatch(clusterOperations.fetchDeployments()),
  fetchContainers: () => dispatch(clusterOperations.fetchContainers()),
  fetchNetworks: () => dispatch(networkOperations.fetchNetworks()),
  fetchNamespaces: () => dispatch(clusterOperations.fetchNamespaces()),
  addDeployment: (data: DeploymentModel.Deployment) => {
    dispatch(clusterOperations.addDeployment(data));
  },
  push: (route: string) => dispatch(push(route))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDeployment);
