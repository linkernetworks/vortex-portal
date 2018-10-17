import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, Popconfirm, Tag, Input } from 'antd';

import * as ConfigmapModel from '@/models/Configmap';
import StatusIcon from '@/components/StatusIcon';
import * as styles from './styles.module.scss';
import withCapitalize from '@/containers/withCapitalize';

const { TextArea } = Input;
const CapitalizedMessage = withCapitalize(FormattedMessage);

interface ConfigmapDetailProps {
  configmap: ConfigmapModel.Configmap;
  removeConfigmap: (id: string) => void;
}

class ConfigmapDetail extends React.PureComponent<
  ConfigmapDetailProps,
  object
> {
  protected renderAction = (id: string | undefined) => {
    if (!!id) {
      return (
        <Popconfirm
          key="action.delete"
          title={<CapitalizedMessage id="action.confirmToDelete" />}
          onConfirm={this.props.removeConfigmap.bind(this, id)}
        >
          <Button>
            <Icon type="delete" /> <CapitalizedMessage id="configmap.delete" />
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button type="dashed" disabled={true}>
          <Icon type="delete" />
          <FormattedMessage id="configmap.undeletable" />
        </Button>
      );
    }
  };

  public render() {
    const { configmap } = this.props;
    return (
      <React.Fragment>
        <div className={styles.contentSection}>
          <h2 style={{ display: 'inline' }}>{configmap.name}</h2>
          <StatusIcon status="running" />
        </div>
        <div className={styles.contentSection}>
          <h3>
            <CapitalizedMessage id="configmap.data" />
          </h3>
          {Object.keys(configmap.data).map(key => (
            <div className={styles.contentSection}>
              <Tag color="red" className={styles.label} key={key}>
                {key}
              </Tag>
              <TextArea rows={20} disabled={true} value={configmap.data[key]} />
            </div>
          ))}
        </div>
        <div className={styles.drawerBottom}>
          {this.renderAction(configmap.id)}
        </div>
      </React.Fragment>
    );
  }
}

export default ConfigmapDetail;
