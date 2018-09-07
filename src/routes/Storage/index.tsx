import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Icon, Table, notification } from 'antd';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { mapValues, find } from 'lodash';
import { Dispatch } from 'redux';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import * as styles from './styles.module.scss';
import StorageForm from '@/components/StorageForm';
import VolumeForm from '@/components/VolumeForm';
import ItemActions from '@/components/ItemActions';
import { RootState, RTDispatch, RootAction } from '@/store/ducks';
import { storageOperations, storageActions } from '@/store/ducks/storage';
import { volumeOperations, volumeActions } from '@/store/ducks/volume';
import { userOperations } from '@/store/ducks/user';
import {
  Storage as StorageModel,
  StorageFields,
  Volume as VolumeModel,
  VolumeFields,
  AccessMode
} from '@/models/Storage';
import * as NamespaceModel from '@/models/Namespace';
import * as namespaceAPI from '@/services/namespace';
import * as UserModel from '@/models/User';
import { FormField } from '@/utils/types';

type StorageProps = OwnProps & InjectedAuthRouterProps & InjectedIntlProps;

interface OwnProps {
  storages: {
    data: Array<StorageModel>;
    isLoading: boolean;
    error: Error | null;
  };
  volumes: {
    data: Array<VolumeModel>;
    isLoading: boolean;
    error: Error | null;
  };
  fetchStorages: () => any;
  fetchVolumes: () => any;
  addStorage: (data: StorageFields) => any;
  addVolume: (data: VolumeFields) => any;
  removeStorage: (id: string) => any;
  removeVolume: (id: string) => any;
  clearStorageError: () => any;
  clearVolumeError: () => any;
  users: Array<UserModel.User>;
  fetchUsers: () => any;
}

interface StorageState {
  isCreatingStorage: boolean;
  isCreatingVolume: boolean;
  tabKey: string;
  namespaces: Array<NamespaceModel.Namespace>;
  storageFields: FormField<StorageFields>;
  volumeFields: FormField<VolumeFields>;
}

const tabList = [
  {
    key: 'storage',
    tab: <FormattedMessage id="storage" />
  },
  {
    key: 'volume',
    tab: <FormattedMessage id="volume" />
  }
];

class Storage extends React.PureComponent<StorageProps, StorageState> {
  private actionColumn: ColumnProps<StorageModel | VolumeModel> = {
    title: this.props.intl.formatMessage({ id: 'action' }),
    render: (_, record) => {
      return (
        <ItemActions
          items={[
            {
              type: 'delete',
              onConfirm: this.handleItemDelete.bind(this, record.id)
            }
          ]}
        />
      );
    }
  };

  private storageColumns: Array<ColumnProps<StorageModel>> = [
    {
      title: this.props.intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: this.props.intl.formatMessage({ id: 'owner' }),
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.type' }),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.storageClassName' }),
      dataIndex: 'storageClassName',
      key: 'storageClassName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.ip' }),
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: this.props.intl.formatMessage({ id: 'storage.path' }),
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: this.props.intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).calendar()
    },
    this.actionColumn
  ];

  private volumeColumns: Array<ColumnProps<VolumeModel>> = [
    {
      title: this.props.intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: this.props.intl.formatMessage({ id: 'owner' }),
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: this.props.intl.formatMessage({ id: 'volume.storageName' }),
      dataIndex: 'storageName',
      key: 'storageName'
    },
    {
      title: this.props.intl.formatMessage({ id: 'volume.accessMode' }),
      dataIndex: 'accessMode',
      key: 'accessMode'
    },
    {
      title: this.props.intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).calendar()
    },
    this.actionColumn
  ];

  private storageFactory = () => {
    return {
      name: {
        value: ''
      },
      type: {
        value: 'nfs'
      },
      ip: {
        value: ''
      },
      path: {
        value: ''
      }
    };
  };

  private volumeFactory = () => {
    return {
      name: {
        value: ''
      },
      namespace: {
        value: ''
      },
      storageName: {
        value: ''
      },
      accessMode: {
        value: AccessMode.ReadWriteMany
      },
      capacity: {
        value: '300Gi'
      }
    };
  };

  constructor(props: StorageProps) {
    super(props);
    this.state = {
      isCreatingStorage: false,
      isCreatingVolume: false,
      tabKey: 'storage',
      namespaces: [],
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    };
  }

  public componentWillMount() {
    this.props.fetchStorages();
    this.props.fetchVolumes();
    this.props.fetchUsers();
  }

  protected getFlatFormFieldValue = (target: string) => {
    return mapValues(this.state[target], 'value');
  };

  protected handleItemDelete = (id: string) => {
    const { tabKey } = this.state;
    switch (tabKey) {
      case 'storage':
        this.props.removeStorage(id);
        break;
      case 'volume':
        this.props.removeVolume(id);
        break;
    }

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'Delete successfully.'
      })
    });
  };

  protected handleAddItem = () => {
    this.setState(prevState => {
      switch (prevState.tabKey) {
        case 'storage':
          return {
            ...prevState,
            isCreatingStorage: true
          };
        case 'volume':
          namespaceAPI.getNamespaces().then(res => {
            this.setState({ namespaces: res.data });
          });
          return {
            ...prevState,
            isCreatingVolume: true
          };
        default:
          return prevState;
      }
    });
  };

  protected handleFormChange = (target: string) => (changedFields: any) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [target]: {
          ...prevState[target],
          ...changedFields
        }
      };
    });
  };

  protected handleFormClose = () => {
    this.props.clearStorageError();
    this.props.clearVolumeError();
    this.setState({
      isCreatingStorage: false,
      isCreatingVolume: false,
      storageFields: this.storageFactory(),
      volumeFields: this.volumeFactory()
    });
  };

  protected handleStorageSubmit = () => {
    const { tabKey } = this.state;

    switch (tabKey) {
      case 'storage':
        this.props.clearStorageError();
        this.props
          .addStorage(this.getFlatFormFieldValue(
            'storageFields'
          ) as StorageFields)
          .then(() => {
            if (!this.props.storages.error) {
              this.setState({
                isCreatingStorage: false,
                storageFields: this.storageFactory()
              });
            }
          });
        break;
      case 'volume':
        this.props.clearVolumeError();
        this.props
          .addVolume(this.getFlatFormFieldValue('volumeFields') as VolumeFields)
          .then(() => {
            if (!this.props.volumes.error) {
              this.setState({
                isCreatingVolume: false,
                volumeFields: this.volumeFactory()
              });
            }
          });
        break;
    }

    const { formatMessage } = this.props.intl;
    notification.success({
      message: formatMessage({
        id: 'action.success'
      }),
      description: formatMessage({
        id: 'Create successfully.'
      })
    });
  };

  public renderTableHeader = () => {
    const { tabKey } = this.state;
    return (
      <Button onClick={this.handleAddItem}>
        <Icon type="plus" /> <FormattedMessage id={`${tabKey}.add`} />
      </Button>
    );
  };

  protected getStorageInfo = (storages: Array<StorageModel>) => {
    return storages.map(storage => {
      const owner = find(this.props.users, user => {
        return user.id === storage.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: storage.id,
        name: storage.name,
        owner: displayName,
        type: storage.type,
        storageClassName: storage.storageClassName,
        ip: storage.id,
        path: storage.ip
      };
    });
  };

  protected getVoulmeInfo = (voulmes: Array<VolumeModel>) => {
    return voulmes.map(volumes => {
      const owner = find(this.props.users, user => {
        return user.id === volumes.ownerID;
      });
      const displayName = owner === undefined ? 'none' : owner.displayName;
      return {
        id: volumes.id,
        name: volumes.name,
        storageName: volumes.storageName,
        owner: displayName,
        accessMode: volumes.accessMode,
        capacity: volumes.capacity
      };
    });
  };

  public renderTabContent = () => {
    const {
      storages,
      volumes,
      clearStorageError,
      clearVolumeError
    } = this.props;

    const {
      tabKey,
      storageFields,
      volumeFields,
      namespaces,
      isCreatingStorage,
      isCreatingVolume
    } = this.state;

    const storageOptions = storages.data.map(storage => storage.name);

    switch (tabKey) {
      case 'storage':
        return (
          <React.Fragment>
            <Table
              rowKey="id"
              columns={this.storageColumns}
              dataSource={this.getStorageInfo(storages.data)}
              className="main-table"
            />
            <StorageForm
              {...storageFields}
              visiable={isCreatingStorage}
              isLoading={storages.isLoading}
              error={storages.error}
              onCancel={this.handleFormClose}
              onChange={this.handleFormChange('storageFields')}
              onSubmit={this.handleStorageSubmit}
              onCloseError={clearStorageError}
            />
          </React.Fragment>
        );
      case 'volume':
        return (
          <React.Fragment>
            <Table
              rowKey="id"
              columns={this.volumeColumns}
              dataSource={this.getVoulmeInfo(volumes.data)}
              className="main-table"
            />
            <VolumeForm
              {...volumeFields}
              visiable={isCreatingVolume}
              isLoading={volumes.isLoading}
              error={volumes.error}
              namespaces={namespaces}
              storageNameOptions={storageOptions}
              onCancel={this.handleFormClose}
              onChange={this.handleFormChange('volumeFields')}
              onSubmit={this.handleStorageSubmit}
              onCloseError={clearVolumeError}
            />
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  public render() {
    const { tabKey } = this.state;

    return (
      <div>
        <Card
          className={styles.card}
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={key => {
            this.setState({ tabKey: key });
          }}
          title={<FormattedMessage id="storage" />}
          extra={this.renderTableHeader()}
        >
          {this.renderTabContent()}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    storages: {
      data: state.storage.storages,
      isLoading: state.storage.isLoading,
      error: state.storage.error
    },
    volumes: {
      data: state.volume.volumes,
      isLoading: state.volume.isLoading,
      error: state.volume.error
    },
    users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: RTDispatch & Dispatch<RootAction>) => ({
  fetchStorages: () => dispatch(storageOperations.fetchStorage()),
  fetchVolumes: () => dispatch(volumeOperations.fetchVolumes()),
  addStorage: (data: StorageFields) =>
    dispatch(storageOperations.addStorage(data)),
  addVolume: (data: VolumeFields) => dispatch(volumeOperations.addVolume(data)),
  removeStorage: (id: string) => dispatch(storageOperations.removeStorage(id)),
  removeVolume: (id: string) => dispatch(volumeOperations.removeVolume(id)),
  clearStorageError: () => dispatch(storageActions.clearStorageError()),
  clearVolumeError: () => dispatch(volumeActions.clearVolumeError()),
  fetchUsers: () => dispatch(userOperations.fetchUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Storage));
