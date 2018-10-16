import * as React from 'react';
import * as ConfigmapModel from '@/models/Configmap';
import * as NamespaceModel from '@/models/Namespace';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Form, Select, Input, Button, Row, Col, Steps } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
};

type ConfigmapFormProps = OwnProps & InjectedIntlProps & FormComponentProps;

interface OwnProps {
  namespaces: Array<NamespaceModel.Namespace>;
  onSubmit: (data: ConfigmapModel.Configmap) => void;
}

class ConfigmapForm extends React.PureComponent<ConfigmapFormProps, any> {
  private fileKey: React.RefObject<Input>;
  private fileValue: any;

  constructor(props: ConfigmapFormProps) {
    super(props);
    this.fileKey = React.createRef();
    this.fileValue = React.createRef();
    this.state = {
      files: new Map()
    };
  }

  protected addFile = () => {
    if (
      this.fileKey.current != null &&
      this.fileValue.current != null &&
      this.fileKey.current.input.value !== '' &&
      this.fileValue.current.textAreaRef.value !== ''
    ) {
      const { files } = this.state;
      const newFiles = new Map(files);
      newFiles.set(
        this.fileKey.current.input.value,
        this.fileValue.current.textAreaRef.value
      );
      this.fileKey.current.input.value = '';
      this.fileValue.current.textAreaRef.value = '';
      this.setState({ files: newFiles });

      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        files: newFiles
      });
    }
  };

  protected deleteFile = (key: string) => {
    const { files } = this.state;
    const newFiles = new Map(files);
    newFiles.delete(key);
    this.setState({ files: newFiles });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      files: newFiles
    });
  };

  protected handleSubmit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const data = {};
        if (values.files) {
          Array.from(values.files.keys()).map((key: string) => {
            data[key] = values.files.get(key);
          });
        }
        const configmap: ConfigmapModel.Configmap = {
          name: values.name,
          namespace: values.namespace,
          data
        };

        this.props.onSubmit(configmap);
      }
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    const steps = [
      {
        title: 'Configmap',
        description: 'Configmap Detail'
      }
    ];
    return (
      <Row>
        <Col span={5}>
          <Steps size="small" direction="vertical" current={0}>
            {steps.map(item => (
              <Step
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </Steps>
        </Col>
        <Col span={19}>
          <Form>
            <FormItem
              {...formItemLayout}
              label={<CapitalizedMessage id="configmap.name" />}
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Input
                  style={{ width: 200 }}
                  placeholder="Give a configmap name"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<CapitalizedMessage id="namespace" />}
            >
              {getFieldDecorator('namespace', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select style={{ width: 200 }} placeholder="Select a namespace">
                  <Option value="default">default</Option>
                  {this.props.namespaces.map(namespace => {
                    return (
                      <Option key={namespace.name} value={namespace.name}>
                        {namespace.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<CapitalizedMessage id="configmap.data" />}
            >
              {getFieldDecorator('files', {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <div>
                  {Array.from(this.state.files.keys()).map((key: string) => {
                    return (
                      <Row key={key}>
                        <Col span={10}>
                          <Input
                            disabled={true}
                            value={key}
                            placeholder="File Name"
                          />
                        </Col>
                        <Col span={10}>
                          <Button
                            style={{ marginLeft: 12 }}
                            shape="circle"
                            icon="close"
                            onClick={() => this.deleteFile(key)}
                          />
                        </Col>
                        <TextArea
                          rows={6}
                          disabled={true}
                          value={this.state.files.get(key)}
                          placeholder="Content"
                        />
                      </Row>
                    );
                  })}
                  <Row>
                    <Col span={10}>
                      <Input
                        ref={this.fileKey}
                        placeholder="File Name"
                        onBlur={this.addFile}
                      />
                    </Col>
                    <Col span={10}>
                      <Button
                        style={{ marginLeft: 12 }}
                        shape="circle"
                        icon="enter"
                        onClick={this.addFile}
                      />
                    </Col>
                    <TextArea
                      rows={6}
                      ref={this.fileValue}
                      placeholder="Content"
                      onBlur={this.addFile}
                    />
                  </Row>
                </div>
              )}
            </FormItem>
            <Button
              style={{ float: 'right' }}
              type="primary"
              onClick={this.handleSubmit}
            >
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default compose<ConfigmapFormProps, OwnProps>(
  Form.create(),
  injectIntl
)(ConfigmapForm);
