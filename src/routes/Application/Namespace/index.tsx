import * as React from 'react';
import * as NamespaceModel from '@/models/Namespace';
import { connect } from 'react-redux';
import * as styles from './styles.module.scss';
import { Card, List, Button, Icon, Popconfirm, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { Dispatch } from 'redux';
import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';

import NamespaceForm from '@/components/NamespaceForm';

interface NamespaceState {
  visibleModal: boolean;
}

type NamespaceProps = OwnProps & InjectedAuthRouterProps;

interface OwnProps {
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

  protected renderAction = (id: string | undefined) => {
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

  public render() {
    const { namespaces } = this.props;
    const columns: Array<ColumnProps<NamespaceModel.Namespace>> = [
      {
        title: <FormattedMessage id="namespace.name" />,
        dataIndex: 'name',
        width: 300
      },
      {
        title: <FormattedMessage id="namespace.createdAt" />,
        render: (_, record) => moment(record.createdAt).calendar()
      },
      {
        title: 'Action',
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
        <Table
          className={styles.table}
          columns={columns}
          dataSource={namespaces}
          size="middle"
        />
        <Button type="dashed" className={styles.add} onClick={this.showCreate}>
          <Icon type="plus" /> <FormattedMessage id="namespace.add" />
        </Button>
        <NamespaceForm
          namespaces={namespaces}
          visible={this.state.visibleModal}
          onCancel={this.hideCreate}
          onSubmit={this.handleSubmit}
        />
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
