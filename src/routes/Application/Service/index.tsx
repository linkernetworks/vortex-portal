import * as React from 'react';
import * as ServiceModel from '@/models/Service';
import { connect } from 'react-redux';
import * as styles from './styles.module.scss';
import { Card, List, Button, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import ServiceForm from '@/components/ServiceForm';

const ListItem = List.Item;

interface ServiceState {
  visibleModal: boolean;
}

interface ServiceProps {
  services: Array<ServiceModel.Service>;
  fetchServices: () => any;
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
    // this.props.addService(service);
    this.setState({ visibleModal: false });
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
      <ListItem key={item.id}>
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
            services={this.props.services}
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
  fetchServices: () => dispatch(clusterOperations.fetchServices())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Service);
