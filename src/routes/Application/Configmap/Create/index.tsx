import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as ConfigmapModel from '@/models/Configmap';
import * as NamespaceModel from '@/models/Namespace';
import { Card, Upload, Icon, notification } from 'antd';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

import { RootState, RTDispatch } from '@/store/ducks';
import { clusterOperations, clusterActions } from '@/store/ducks/cluster';

import * as styles from './styles.module.scss';

import ConfigmapForm from '@/components/ConfigmapForm';
import { loadToken } from '@/utils/auth';

const Dragger = Upload.Dragger;

interface CreateConfigmapState {
  tabKey: string;
}

type CreateConfigmapProps = OwnProps &
  InjectedAuthRouterProps &
  InjectedIntlProps;

interface OwnProps {
  namespaces: Array<NamespaceModel.Namespace>;
  fetchNamespaces: () => any;
  addConfigmap: (data: ConfigmapModel.Configmap) => any;
  push: (route: string) => any;
  error: Error | null;
  clearClusterError: () => any;
}

const tabList = [
  {
    key: 'addConfigmap',
    tab: <FormattedMessage id="configmap.add" />
  },
  {
    key: 'addConfigmapByYAML',
    tab: <FormattedMessage id="configmap.addByYAML" />
  }
];

class CreateConfigmap extends React.Component<
  CreateConfigmapProps,
  CreateConfigmapState
> {
  constructor(props: CreateConfigmapProps) {
    super(props);
    this.state = {
      tabKey: 'addConfigmap'
    };
  }

  public componentDidMount() {
    this.props.fetchNamespaces();
  }

  protected handleUploadChange = (info: any) => {
    const { formatMessage } = this.props.intl;

    if (info.file.status === 'done') {
      this.props.push('/application/configmap');
      notification.success({
        message: formatMessage({
          id: 'action.success'
        }),
        description: formatMessage({
          id: 'configmap.hint.create.success'
        })
      });
    } else if (info.file.status === 'error') {
      notification.error({
        message: formatMessage({
          id: 'action.failure'
        }),
        description:
          formatMessage({
            id: 'configmap.hint.create.failure'
          }) +
          ' (' +
          this.props.error +
          ')'
      });
    }
  };

  protected handleSubmit = (configmap: ConfigmapModel.Configmap) => {
    this.props.clearClusterError();
    this.props.addConfigmap(configmap);
    this.props.push('/application/configmap');

    const { formatMessage } = this.props.intl;

    if (!this.props.error) {
      notification.success({
        message: formatMessage({
          id: 'action.success'
        }),
        description: formatMessage({
          id: 'configmap.hint.create.success'
        })
      });
    } else {
      notification.error({
        message: formatMessage({
          id: 'action.failure'
        }),
        description:
          formatMessage({
            id: 'configmap.hint.create.failure'
          }) +
          ' (' +
          this.props.error.message +
          ')'
      });
    }
  };

  public renderTabContent = () => {
    const { tabKey } = this.state;

    switch (tabKey) {
      case 'addConfigmap':
        return (
          <ConfigmapForm
            key={tabKey}
            namespaces={this.props.namespaces}
            onSubmit={this.handleSubmit}
          />
        );
      case 'addConfigmapByYAML':
        return (
          <Dragger
            name="file"
            headers={{
              Authorization: `Bearer ${loadToken()}`
            }}
            multiple={false}
            showUploadList={false}
            action="/v1/configmaps/upload/yaml"
            onChange={this.handleUploadChange}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>
        );
      default:
        return null;
    }
  };

  public render() {
    const { tabKey } = this.state;

    return (
      <Card
        className={styles.card}
        bodyStyle={{ height: '90%' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.setState({ tabKey: key });
        }}
      >
        {this.renderTabContent()}
      </Card>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    namespaces: state.cluster.namespaces,
    error: state.cluster.error
  };
};

const mapDispatchToProps = (dispatch: RTDispatch) => ({
  fetchNamespaces: () => dispatch(clusterOperations.fetchNamespaces()),
  addConfigmap: (data: ConfigmapModel.Configmap) => {
    dispatch(clusterOperations.addConfigmap(data));
  },
  push: (route: string) => dispatch(push(route)),
  clearClusterError: () => dispatch(clusterActions.clearClusterError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CreateConfigmap));
