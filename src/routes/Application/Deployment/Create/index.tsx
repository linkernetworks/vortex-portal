import * as React from 'react';
import * as DeploymentModel from '@/models/Deployment';
import * as ContainerModel from '@/models/Container';
import * as NamespaceModel from '@/models/Namespace';
import { networkModels, networkOperations } from '@/store/ducks/network';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Card, notification } from 'antd';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';
import { volumeOperations } from '@/store/ducks/volume';
import { Volume as VolumeModel } from '@/models/Storage';

import * as styles from './styles.module.scss';

import DeploymentForm from '@/components/DeploymentForm';

interface CreateDeploymentState {
  tabKey: string;
}

type CreateDeploymentProps = OwnProps & InjectedAuthRouterProps;

interface OwnProps {
  deployments: DeploymentModel.Controllers;
  allDeployments: Array<string>;
  containers: ContainerModel.Containers;
  allContainers: Array<string>;
  networks: Array<networkModels.Network>;
  namespaces: Array<NamespaceModel.Namespace>;
  volumes: Array<VolumeModel>;
  fetchDeployments: () => any;
  fetchNetworks: () => any;
  fetchNamespaces: () => any;
  fetchVolumes: () => any;
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
    this.props.fetchNetworks();
    this.props.fetchNamespaces();
    this.props.fetchVolumes();
  }

  protected handleSubmit = (deployment: DeploymentModel.Deployment) => {
    this.props.addDeployment(deployment);
    this.props.push('/application/deployment');
    return notification.success({
      message: 'Success',
      description: 'Create the deployment successfully.'
    });
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
            volumes={this.props.volumes}
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
            volumes={this.props.volumes}
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
    namespaces: state.cluster.namespaces,
    volumes: state.volume.volumes
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchDeployments: () => dispatch(clusterOperations.fetchDeployments()),
  fetchNetworks: () => dispatch(networkOperations.fetchNetworks()),
  fetchNamespaces: () => dispatch(clusterOperations.fetchNamespaces()),
  fetchVolumes: () => dispatch(volumeOperations.fetchVolumes()),
  addDeployment: (data: DeploymentModel.Deployment) => {
    dispatch(clusterOperations.addDeployment(data));
  },
  push: (route: string) => dispatch(push(route))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDeployment);
