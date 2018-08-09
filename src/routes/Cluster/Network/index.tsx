import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Tag, Icon, Tree, List, Popconfirm } from 'antd';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as styles from './styles.module.scss';
import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations, clusterSelectors } from '@/store/ducks/cluster';
import {
  networkModels,
  networkSelectors,
  networkOperations
} from '@/store/ducks/network';
import { Nodes } from '@/models/Node';

import NetworkFrom from '@/components/NetworkForm';

const ListItem = List.Item;
const TreeNode = Tree.TreeNode;

interface NetworkState {
  isCreating: boolean;
}

interface NetworkProps {
  nodes: Nodes;
  nodesWithUsedInterfaces: {
    [node: string]: Array<string>;
  };
  networks: Array<networkModels.Network>;
  isLoading: boolean;
  networkError?: Error;
  fetchNodes: () => any;
  fetchNetworks: () => any;
  addNetwork: (data: networkModels.NetworkFields) => any;
  removeNetwork: (id: string) => any;
}

class Network extends React.Component<NetworkProps, NetworkState> {
  constructor(props: NetworkProps) {
    super(props);
    this.state = {
      isCreating: false
    };
  }

  public componentDidMount() {
    this.props.fetchNodes();
    this.props.fetchNetworks();
  }

  protected handleSubmit = (
    data: networkModels.NetworkFields,
    successCB: () => void
  ) => {
    this.props.addNetwork(data).then(() => {
      this.setState({ isCreating: false });
      successCB();
    });
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

  protected renderListItemAction = (id: string) => {
    return [
      <Popconfirm
        key="action.delete"
        title={<FormattedMessage id="action.confirmToDelete" />}
        onConfirm={this.props.removeNetwork.bind(this, id)}
      >
        <a href="javascript:;">
          <FormattedMessage id="action.delete" />
        </a>
      </Popconfirm>
    ];
  };

  protected renderListItemContent = (
    title: string | React.ReactNode,
    content: string | React.ReactNode,
    col = 1
  ) => {
    return (
      <div className={styles.column} style={{ flex: col }}>
        <div className="title">{title}</div>
        <div className="content">{content}</div>
      </div>
    );
  };

  protected renderListItem = (item: networkModels.Network) => {
    const type =
      item.isDPDKPort && item.type === networkModels.dataPathType.netdev
        ? 'netdev with DPDK'
        : (item.type as string);
    return (
      <ListItem key={item.id} actions={this.renderListItemAction(item.id)}>
        <div className={styles.content}>
          <div className={styles.leading}>
            <h3 className="title" title={item.name}>
              {item.name}
            </h3>
          </div>
          <div className={styles.property}>
            {this.renderListItemContent(
              <FormattedMessage id={`network.type`} />,
              type
            )}

            {this.renderListItemContent(
              <FormattedMessage id={`network.bridgeName`} />,
              item.bridgeName
            )}

            {this.renderListItemContent(
              <FormattedMessage id={`network.nodes`} />,
              <Tree showIcon={true} selectable={false}>
                {item.nodes.map((node, idx) => (
                  <TreeNode
                    title={node.name}
                    key={`${node.name}-${idx}`}
                    icon={<FontAwesomeIcon icon="server" />}
                  >
                    {node.physicalInterfaces.map(physicalInterface => (
                      <TreeNode
                        key={`${node.name}-${idx}-${physicalInterface.name}-${
                          physicalInterface.pciID
                        }`}
                        icon={<FontAwesomeIcon icon="plug" />}
                        title={
                          physicalInterface.name || physicalInterface.pciID
                        }
                      />
                    ))}
                  </TreeNode>
                ))}
              </Tree>,
              2
            )}

            {this.renderListItemContent(
              <FormattedMessage id={`network.vlanTags`} />,
              item.vlanTags.length === 0 ? (
                <FormattedMessage id="network.noTrunk" />
              ) : (
                this.renderTags(item.vlanTags)
              ),
              2
            )}

            {this.renderListItemContent(
              <FormattedMessage id={'network.createdAt'} />,
              moment(item.createdAt).calendar()
            )}
          </div>
        </div>
      </ListItem>
    );
  };

  public render() {
    const { networks } = this.props;
    const networkNames = networks.map(network => network.name);
    return (
      <div>
        <Card title="Network">
          <List
            bordered={true}
            dataSource={networks}
            renderItem={this.renderListItem}
          />
          <Button
            type="dashed"
            className={styles.add}
            onClick={() => this.setState({ isCreating: true })}
          >
            <Icon type="plus" /> <FormattedMessage id="network.add" />
          </Button>
        </Card>
        <NetworkFrom
          visible={this.state.isCreating}
          isLoading={this.props.isLoading}
          onCancel={() => this.setState({ isCreating: false })}
          onSubmit={this.handleSubmit}
          networkNames={networkNames}
          nodes={this.props.nodes}
          nodesWithUsedInterfaces={this.props.nodesWithUsedInterfaces}
        />
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
    networkError: state.network.error
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchNodes: () => dispatch(clusterOperations.fetchNodes()),
  fetchNetworks: () => dispatch(networkOperations.fetchNetworks()),
  addNetwork: (data: networkModels.NetworkFields) =>
    dispatch(networkOperations.addNetwork(data)),
  removeNetwork: (id: string) => dispatch(networkOperations.removeNetwork(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Network);