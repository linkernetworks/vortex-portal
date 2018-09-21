import * as React from 'react';
import * as UserModel from '@/models/User';
import * as ServiceModel from '@/models/Service';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import { Button, Icon, Tree, Tag, Card, Table, notification } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { find } from 'lodash';

import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';
import { userOperations } from '@/store/ducks/user';
import ServiceForm from '@/components/ServiceForm';
import ItemActions from '@/components/ItemActions';

import * as namespaceAPI from '@/services/namespace';

const TreeNode = Tree.TreeNode;

interface ServiceState {
  visibleModal: boolean;
  namespaces: Array<NamespaceModel.Namespace>;
}

type ServiceProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;
interface OwnProps {
  services: Array<ServiceModel.Service>;
  fetchServices: () => any;
  addService: (data: ServiceModel.Service) => any;
  removeService: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
}

class Service extends React.Component<ServiceProps, ServiceState> {
  private columns: Array<ColumnProps<ServiceModel.Service>> = [
    {
      title: <FormattedMessage id="name" />,
      dataIndex: 'name'
    },
    {
      title: <FormattedMessage id="owner" />,
      dataIndex: 'owner'
    },
    {
      title: <FormattedMessage id="namespace" />,
      dataIndex: 'namespace'
    },
    {
      title: <FormattedMessage id="service.type" />,
      dataIndex: 'type'
    },
    {
      title: <FormattedMessage id="service.selectors" />,
      render: (_, record) => (
        <div>
          {Object.keys(record.selector).map((key: string) => (
            <Tag key={key}>{`${key} : ${record.selector[key]}`}</Tag>
          ))}
        </div>
      )
    },
    {
      title: <FormattedMessage id="service.ports" />,
      render: (_, record) => (
        <Tree showIcon={true} selectable={false}>
          {record.ports.map((port: ServiceModel.ServicePort) => (
            <TreeNode
              title={port.name}
              key={port.name}
              icon={<Icon type="tags" />}
            >
              <TreeNode
                icon={<Icon type="tag-o" />}
                title={`Target Port: ${port.targetPort}`}
              />
              <TreeNode
                icon={<Icon type="tag-o" />}
                title={`Port: ${port.port}`}
              />
              {record.type === 'NodePort' && (
                <TreeNode
                  icon={<Icon type="tag-o" />}
                  title={`Node Port: ${port.nodePort}`}
                />
              )}
            </TreeNode>
          ))}
        </Tree>
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
              onConfirm: this.handleRemoveService.bind(this, record.id)
            }
          ]}
        />
      )
    }
  ];
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visibleModal: false,
      namespaces: []
    };
  }

  public componentDidMount() {
    this.props.fetchServices();
    this.props.fetchUsers();
  }

  protected showCreate = () => {
    namespaceAPI.getNamespaces().then(res => {
      this.setState({ namespaces: res.data });
    });
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (service: ServiceModel.Service) => {
    this.props.addService(service);
    this.setState({ visibleModal: false });

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'service.hint.create.success'
      })
    });
  };

  protected handleRemoveService = (id: string) => {
    this.props.removeService(id);

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'service.hint.delete.success'
      })
    });
  };

  protected getServiceInfo = (services: Array<ServiceModel.Service>) => {
    return services.map(service => {
      const owner = find(this.props.users, user => {
        return user.id === service.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: service.id,
        name: service.name,
        owner: displayName,
        type: service.type,
        namespace: service.namespace,
        selector: service.selector,
        ports: service.ports
      };
    });
  };

  public render() {
    const { services } = this.props;
    return (
      <div>
        <Card
          title={<FormattedMessage id="service" />}
          extra={
            <Button onClick={this.showCreate}>
              <Icon type="plus" /> <FormattedMessage id="service.add" />
            </Button>
          }
        >
          <Table
            className="main-table"
            columns={this.columns}
            dataSource={this.getServiceInfo(this.props.services)}
          />
          <ServiceForm
            services={services}
            namespaces={this.state.namespaces}
            visible={this.state.visibleModal}
            onCancel={this.hideCreate}
            onSubmit={this.handleSubmit}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    services: state.cluster.services,
    users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchServices: () => dispatch(clusterOperations.fetchServices()),
  addService: (data: ServiceModel.Service) => {
    dispatch(clusterOperations.addService(data));
  },
  removeService: (id: string) => dispatch(clusterOperations.removeService(id)),
  fetchUsers: () => dispatch(userOperations.fetchUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Service));
