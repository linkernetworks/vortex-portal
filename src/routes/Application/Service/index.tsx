import * as React from 'react';
import * as ServiceModel from '@/models/Service';
import { connect } from 'react-redux';
import * as styles from './styles.module.scss';
import { Card, List, Button, Icon, Tree, Tag, Popconfirm } from 'antd';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import ServiceForm from '@/components/ServiceForm';

const ListItem = List.Item;
const TreeNode = Tree.TreeNode;

interface ServiceState {
  visibleModal: boolean;
}

interface ServiceProps {
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

  protected renderListItemAction = (id: string | undefined) => {
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

  protected renderListItem = (item: ServiceModel.Service) => {
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
              <FormattedMessage id={`service.namespace`} />,
              item.namespace
            )}
            {this.renderListItemContent(
              <FormattedMessage id={`service.type`} />,
              item.type
            )}
            {this.renderListItemContent(
              <FormattedMessage id={`service.selectors`} />,
              <Tree showIcon={true} selectable={false}>
                {Object.keys(item.selector).map((key: string) => (
                  <Tag key={key}>{`${key} : ${item.selector[key]}`}</Tag>
                ))}
              </Tree>
            )}
            {this.renderListItemContent(
              <FormattedMessage id={`service.ports`} />,
              <Tree showIcon={true} selectable={false}>
                {item.ports.map((port: ServiceModel.ServicePort) => (
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
                    <TreeNode
                      icon={<Icon type="tag-o" />}
                      title={`Node Port: ${port.nodePort}`}
                    />
                  </TreeNode>
                ))}
              </Tree>
            )}
            {this.renderListItemContent(
              <FormattedMessage id={`service.createAt`} />,
              moment(item.createdAt).calendar()
            )}
          </div>
        </div>
      </ListItem>
    );
  };

  public render() {
    const { services } = this.props;
    return (
      <div>
        <Card title="Service">
          <List
            bordered={true}
            dataSource={services}
            renderItem={this.renderListItem}
          />
          <Button
            type="dashed"
            className={styles.add}
            onClick={this.showCreate}
          >
            <Icon type="plus" /> <FormattedMessage id="service.add" />
          </Button>
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
