import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Button, Icon, Dropdown, Select, Input, Radio, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './styles.module.scss';
import * as Pod from '@/models/Pod';
import * as Network from '@/models/Network';
import EditableTagGroup from '@/components/EditableTagGroup';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface PodFormProps extends FormComponentProps {
  networks: Array<Network.Network>;
}

class PodForm extends React.PureComponent<PodFormProps, object> {
  public render() {
    return (
      <Form>
        <h2>Pod</h2>
        <FormItem label={<FormattedMessage id="pod.name" />}>
          <Input placeholder="Pod Name" />
        </FormItem>
        <h2>Container</h2>
        <FormItem label={<FormattedMessage id="container.detail.name" />}>
          <Input placeholder="Container Name" />
        </FormItem>
        <FormItem label={<FormattedMessage id="container.detail.image" />}>
          <Input placeholder="Image" />
        </FormItem>
        <FormItem label={<FormattedMessage id="container.detail.command" />}>
          <EditableTagGroup />
        </FormItem>
        <h2>Network</h2>
        <FormItem label={<FormattedMessage id="network.networkName" />}>
          <Select placeholder="Select a network" style={{ width: 200 }}>
            <Option value="hostNetwork">Host Network</Option>
            {this.props.networks.map(network => {
              return (
                <Option key={network.id} value={network.name}>
                  {network.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem label={<FormattedMessage id="network.interfaceName" />}>
          <Input placeholder="Interface Name" />
        </FormItem>
        <FormItem label={<FormattedMessage id="network.VLANTag" />}>
          <EditableTagGroup />
        </FormItem>
        <FormItem label={<FormattedMessage id="network.ipAddress" />}>
          <Input placeholder="IP Address" />
        </FormItem>
        <FormItem label={<FormattedMessage id="network.netmask" />}>
          <Input placeholder="Mask" />
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(PodForm);
