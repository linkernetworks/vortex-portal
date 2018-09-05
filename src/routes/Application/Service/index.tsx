import * as React from 'react';
import * as ServiceModel from '@/models/Service';
import { connect } from 'react-redux';
import * as styles from './styles.module.scss';
import { Button, Icon, Tree, Tag, Popconfirm, Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import ServiceForm from '@/components/ServiceForm';

const TreeNode = Tree.TreeNode;

interface ServiceState {
  visibleModal: boolean;
}

type ServiceProps = OwnProps & InjectedAuthRouterProps;
interface OwnProps {
  services: Array<ServiceModel.Service>;
  fetchServices: () => any;
  addService: (data: ServiceModel.Service) => any;
  removeService: (id: string) => any;
}

class Service extends React.Component<ServiceProps, ServiceState> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visibleModal: false
    };
  }

  public componentDidMount() {
    this.props.fetchServices();
  }

  protected showCreate = () => {
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (service: ServiceModel.Service) => {
    this.props.addService(service);
    this.setState({ visibleModal: false });
  };

  protected renderAction = (id: string | undefined) => {
    return [
      <Popconfirm
        key="action.delete"
        title={<FormattedMessage id="action.confirmToDelete" />}
        onConfirm={this.props.removeService.bind(this, id)}
      >
        <a href="javascript:;">
          <FormattedMessage id="action.delete" />
        </a>
      </Popconfirm>
    ];
  };

  public render() {
    const { services } = this.props;
    const columns: Array<ColumnProps<ServiceModel.Service>> = [
      {
        title: <FormattedMessage id="name" />,
        dataIndex: 'name'
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
          <div className={styles.drawerBottom}>
            {this.renderAction(record.id)}
          </div>
        )
      }
    ];
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
            className={styles.table}
            columns={columns}
            dataSource={services}
            size="small"
          />
          <ServiceForm
            services={services}
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
    services: state.cluster.services
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchServices: () => dispatch(clusterOperations.fetchServices()),
  addService: (data: ServiceModel.Service) => {
    dispatch(clusterOperations.addService(data));
  },
  removeService: (id: string) => dispatch(clusterOperations.removeService(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Service);
