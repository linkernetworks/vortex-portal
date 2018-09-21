import * as React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Tag,
  Icon,
  Tree,
  Card,
  Table,
  notification,
  Modal
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { find, get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import * as styles from './styles.module.scss';
import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations, clusterSelectors } from '@/store/ducks/cluster';
import { userOperations } from '@/store/ducks/user';
import {
  networkModels,
  networkSelectors,
  networkOperations
} from '@/store/ducks/network';
import * as UserModel from '@/models/User';
import { Nodes } from '@/models/Node';
import NetworkFrom from '@/components/NetworkForm';
import ItemActions from '@/components/ItemActions';
import ExecTerminal from '@/components/ExecTerminal';

const TreeNode = Tree.TreeNode;

interface NetworkState {
  isCreating: boolean;
  openingExec?: {
    node: string;
    namespace: string;
    podName: string;
    containerName: string;
  };
}

type NetworkProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps {
  nodes: Nodes;
  nodesWithUsedInterfaces: {
    [node: string]: Array<string>;
  };
  networks: Array<networkModels.Network>;
  isLoading: boolean;
  networkError?: Error | null;
  fetchNodes: () => any;
  fetchNetworks: () => any;
  addNetwork: (data: networkModels.NetworkFields) => any;
  removeNetwork: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
}

class Network extends React.Component<NetworkProps, NetworkState> {
  private columns: Array<ColumnProps<networkModels.Network>> = [
    {
      title: <FormattedMessage id="name" />,
      dataIndex: 'name'
    },
    {
      title: <FormattedMessage id="owner" />,
      dataIndex: 'owner'
    },
    {
      title: <FormattedMessage id="network.type" />,
      dataIndex: 'type'
    },
    {
      title: <FormattedMessage id="network.bridgeName" />,
      dataIndex: 'bridgeName'
    },
    {
      title: <FormattedMessage id="node" />,
      render: (_, record) => (
        <Tree showIcon={true} onSelect={this.handleOpenExec(record.bridgeName)}>
          {record.nodes.map(node => (
            <TreeNode
              title={node.name}
              key={`[node]-${node.name}`}
              icon={<FontAwesomeIcon icon="server" />}
            >
              {node.physicalInterfaces.map(physicalInterface => (
                <TreeNode
                  key={`[interface]-${node.name}-${physicalInterface.name}-${
                    physicalInterface.pciID
                  }`}
                  icon={<FontAwesomeIcon icon="plug" />}
                  title={physicalInterface.name || physicalInterface.pciID}
                />
              ))}
            </TreeNode>
          ))}
        </Tree>
      )
    },
    {
      title: <FormattedMessage id={`network.VLANTags`} />,
      render: (_, record) =>
        record.vlanTags.length === 0 ? (
          <FormattedMessage id="network.noTrunk" />
        ) : (
          this.renderTags(record.vlanTags)
        )
    },
    {
      title: <FormattedMessage id="createdAt" />,
      render: (_, record) => moment(record.createdAt).calendar()
    },
    {
      title: <FormattedMessage id="action" />,
      key: 'action',
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'delete',
              onConfirm: this.handleRemoveNetwork.bind(this, record.id)
            }
          ]}
        />
      )
    }
  ];

  public readonly state: NetworkState = {
    isCreating: false
  };

  public componentDidMount() {
    this.props.fetchNodes();
    this.props.fetchNetworks();
    this.props.fetchUsers();
  }

  protected handleSubmit = (
    data: networkModels.NetworkFields,
    successCB: () => void
  ) => {
    this.props.addNetwork(data).then(() => {
      this.setState({ isCreating: false });
      successCB();
    });

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'network.hint.create.success'
      })
    });
  };

  protected handleOpenExec = (bridgeName: string) => (
    selectedKeys: Array<string>
  ) => {
    if (!/^(\[node\])/.test(selectedKeys[0])) {
      return;
    }

    // get exec params from API
    console.log(bridgeName);
    console.log(selectedKeys);

    this.setState({
      openingExec: {
        node: selectedKeys[0].replace('[node]-', ''),
        namespace: 'vortex',
        podName: 'network-controller-server-unix-8jsbv',
        containerName: 'network-controller-server-unix'
      }
    });
  };

  protected handleRemoveNetwork = (id: string) => {
    this.props.removeNetwork(id);

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'network.hint.delete.success'
      })
    });
  };

  protected handleCloseExec = () => {
    this.setState({ openingExec: undefined });
  };

  protected renderTags = (tags: Array<string | number>) => {
    return (
      <div className={styles.tags}>
        {tags.map(text => (
          <Tag className={styles.tag} key={text}>
            {text}
          </Tag>
        ))}
      </div>
    );
  };

  protected getNetworkInfo = (networks: Array<networkModels.Network>) => {
    return networks.map(network => {
      const owner = find(this.props.users, user => {
        return user.id === network.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: network.id,
        name: network.name,
        owner: displayName,
        type: network.type,
        bridgeName: network.bridgeName,
        nodes: network.nodes,
        vlanTags: network.vlanTags
      };
    });
  };

  public render() {
    const { networks } = this.props;
    const { openingExec } = this.state;
    const networkNames = networks.map(network => network.name);

    return (
      <div>
        <Card
          title={<FormattedMessage id="network" />}
          extra={
            <Button onClick={() => this.setState({ isCreating: true })}>
              <Icon type="plus" /> <FormattedMessage id="network.add" />
            </Button>
          }
        >
          <Table
            className="main-table"
            rowKey="id"
            columns={this.columns}
            dataSource={this.getNetworkInfo(this.props.networks)}
          />
          <NetworkFrom
            visible={this.state.isCreating}
            isLoading={this.props.isLoading}
            onCancel={() => this.setState({ isCreating: false })}
            onSubmit={this.handleSubmit}
            networkNames={networkNames}
            nodes={this.props.nodes}
            nodesWithUsedInterfaces={this.props.nodesWithUsedInterfaces}
          />
        </Card>
        <Modal
          visible={!!openingExec}
          title={get(this.state.openingExec, 'node')}
          className={styles['terminal-modal']}
          onCancel={this.handleCloseExec}
          footer={null}
          width={960}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
        >
          {openingExec && (
            <ExecTerminal
              namespace={openingExec.namespace}
              podName={openingExec.podName}
              containerName={openingExec.containerName}
              onClose={this.handleCloseExec}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    allNodes: state.cluster.allNodes,
    nodes: clusterSelectors.getNodesWithPhysicalInterfaces(state.cluster),
    nodesWithUsedInterfaces: networkSelectors.NodesWithUsedInterface(
      state.network
    ),
    networks: state.network.networks,
    isLoading: state.network.isLoading,
    networkError: state.network.error,
    users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchNodes: () => dispatch(clusterOperations.fetchNodes()),
  fetchNetworks: () => dispatch(networkOperations.fetchNetworks()),
  addNetwork: (data: networkModels.NetworkFields) =>
    dispatch(networkOperations.addNetwork(data)),
  removeNetwork: (id: string) => dispatch(networkOperations.removeNetwork(id)),
  fetchUsers: () => dispatch(userOperations.fetchUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Network));
