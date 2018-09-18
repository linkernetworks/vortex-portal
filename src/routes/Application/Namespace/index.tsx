import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';
import * as NamespaceModel from '@/models/Namespace';
import NamespaceForm from '@/components/NamespaceForm';
import ItemActions from '@/components/ItemActions';

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

class Namespace extends React.PureComponent<NamespaceProps, NamespaceState> {
  private columns: Array<ColumnProps<NamespaceModel.Namespace>> = [
    {
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      width: 300
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
              onConfirm: this.props.removeNamespace.bind(this, record.id)
            }
          ]}
        />
      )
    }
  ];

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

  public render() {
    const { namespaces } = this.props;

    return (
      <div>
        <Card
          title={<FormattedMessage id="namespace" />}
          extra={
            <Button onClick={this.showCreate}>
              <Icon type="plus" /> <FormattedMessage id="namespace.add" />
            </Button>
          }
        >
          <Table
            className="main-table"
            columns={this.columns}
            dataSource={namespaces}
          />
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
