import * as React from 'react';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import * as styles from './styles.module.scss';
import { Card, List, Button, Icon, Popconfirm } from 'antd';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import NamespaceForm from '@/components/NamespaceForm';

const ListItem = List.Item;

interface NamespaceState {
  visibleModal: boolean;
}

interface NamespaceProps {
  namespaces: Array<NamespaceModel.Namespace>;
  fetchNamespaces: () => any;
  addNamespace: (data: NamespaceModel.Namespace) => any;
  removeNamespace: (id: string) => any;
}

class Namespace extends React.Component<NamespaceProps, NamespaceState> {
  constructor(props: NamespaceProps) {
    super(props);
    this.state = {
      visibleModal: false
    };
  }

  public componentDidMount() {
    this.props.fetchNamespaces();
  }

  protected showCreate = () => {
    this.setState({ visibleModal: true });
  };

  protected hideCreate = () => {
    this.setState({ visibleModal: false });
  };

  protected handleSubmit = (namespace: NamespaceModel.Namespace) => {
    this.props.addNamespace(namespace);
    this.setState({ visibleModal: false });
  };

  protected renderListItemAction = (id: string | undefined) => {
    return [
      <Popconfirm
        key="action.delete"
        title={<FormattedMessage id="action.confirmToDelete" />}
        onConfirm={this.props.removeNamespace.bind(this, id)}
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

  protected renderListItem = (item: NamespaceModel.Namespace) => {
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
              <FormattedMessage id={`service.createAt`} />,
              moment(item.createdAt).calendar()
            )}
          </div>
        </div>
      </ListItem>
    );
  };

  public render() {
    const { namespaces } = this.props;
    return (
      <div>
        <Card title="Namespace">
          <List
            bordered={true}
            dataSource={namespaces}
            renderItem={this.renderListItem}
          />
          <Button
            type="dashed"
            className={styles.add}
            onClick={this.showCreate}
          >
            <Icon type="plus" /> <FormattedMessage id="namespace.add" />
          </Button>
          <NamespaceForm
            namespaces={namespaces}
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
    namespaces: state.cluster.namespaces
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchNamespaces: () => dispatch(clusterOperations.fetchNamespaces()),
  addNamespace: (data: NamespaceModel.Namespace) => {
    dispatch(clusterOperations.addNamespace(data));
  },
  removeNamespace: (id: string) => {
    dispatch(clusterOperations.removeNamespace(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Namespace);
