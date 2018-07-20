import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Button, Icon, Dropdown, Select, Input, Radio, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './styles.module.scss';
import * as Network from '@/models/Network';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface NetworkFormProps extends FormComponentProps {
  // nodes: Array<>;
  name: string;
}

class NetworkForm extends React.PureComponent<NetworkFormProps, object> {
  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem label={<FormattedMessage id="network.networkName" />}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please enter the network name.'
              },
              {
                validator(rule, value, callback) {
                  if (value === 'e') {
                    callback(rule.message);
                  } else {
                    callback();
                  }
                },
                message: 'Please enter the unique network name.'
              }
            ]
          })(<Input placeholder="Network Name" />)}
        </FormItem>
        <FormItem label={<FormattedMessage id="network.type" />}>
          <RadioButton>
            {/* <RadioButton value=""></RadioButton> */}
          </RadioButton>
        </FormItem>
        <FormItem label={<FormattedMessage id="network.nodes" />}>
          <Input />
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(NetworkForm);
