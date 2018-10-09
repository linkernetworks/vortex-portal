import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Card, Table, notification } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { Dispatch } from 'redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import { find } from 'lodash';

import { RootState, RootAction, RTDispatch } from '@/store/ducks';
import { clusterOperations } from '@/store/ducks/cluster';
import { userOperations } from '@/store/ducks/user';
import * as UserModel from '@/models/User';
import * as NamespaceModel from '@/models/Namespace';

import NamespaceForm from '@/components/NamespaceForm';
import ItemActions from '@/components/ItemActions';
import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);

interface NamespaceState {
  visibleModal: boolean;
}

type NamespaceProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps {
  namespaces: Array<NamespaceModel.Namespace>;
  fetchNamespaces: () => any;
  addNamespace: (data: NamespaceModel.Namespace) => any;
  removeNamespace: (id: string) => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
}

class Namespace extends React.PureComponent<NamespaceProps, NamespaceState> {
  private columns: Array<ColumnProps<NamespaceModel.Namespace>> = [
    {
      title: <CapitalizedMessage id="name" />,
      dataIndex: 'name',
      width: 300
    },
    {
      title: <CapitalizedMessage id="owner" />,
      dataIndex: 'owner'
    },
    {
      title: <CapitalizedMessage id="createdAt" />,
      render: (_, record) => moment(record.createdAt).calendar()
    },
    {
      title: <CapitalizedMessage id="action" />,
      key: 'action',
      render: (_, record) => (
        <ItemActions
          items={[
            {
              type: 'delete',
              onConfirm: this.handleRemoveNamespace.bind(this, record.id)
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
    this.props.fetchUsers();
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

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'namespace.hint.create.success'
      })
    });
  };

  protected handleRemoveNamespace = (id: string) => {
    this.props.removeNamespace(id);

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'namespace.hint.delete.success'
      })
    });
  };

  // TODO: Selector
  protected getNamespaceInfo = (
    namespaces: Array<NamespaceModel.Namespace>
  ) => {
    return namespaces.map(namespace => {
      const owner = find(this.props.users, user => {
        return user.id === namespace.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: namespace.id,
        name: namespace.name,
        owner: displayName,
        age: moment(namespace.createdAt).calendar()
      };
    });
  };

  public render() {
    const { namespaces } = this.props;
    return (
      <div>
        <Card
          title={<CapitalizedMessage id="namespace" />}
          extra={
            <Button onClick={this.showCreate}>
              <Icon type="plus" /> <CapitalizedMessage id="namespace.add" />
            </Button>
          }
        >
          <Table
            className="main-table"
            rowKey="name"
            columns={this.columns}
            dataSource={this.getNamespaceInfo(this.props.namespaces)}
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
    namespaces: state.cluster.namespaces,
    users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchNamespaces: () => dispatch(clusterOperations.fetchNamespaces()),
  addNamespace: (data: NamespaceModel.Namespace) => {
    dispatch(clusterOperations.addNamespace(data));
  },
  removeNamespace: (id: string) => {
    dispatch(clusterOperations.removeNamespace(id));
  },
  fetchUsers: () => dispatch(userOperations.fetchUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Namespace));
