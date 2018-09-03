import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Subtract } from '@/utils/types';

export interface InjectedProps {
  requiredRule: (
    field: string
  ) => {
    required: boolean;
    message: React.ReactElement<FormattedMessage>;
  };
}

const withReqiredRule = <WrappedProps extends InjectedProps>(
  WrappedComponent: React.ComponentType<WrappedProps>
) => {
  // These props will be added to original component type
  type HocProps = Subtract<WrappedProps, InjectedProps>;

  return class extends React.PureComponent<HocProps, object> {
    // Enhance component name for debugging and React-Dev-Tools
    public static displayName = `withRequiredRule(${WrappedComponent})`;

    protected fieldRequiredRule = (field: string) => {
      return {
        required: true,
        message: (
          <FormattedMessage
            id="form.message.required"
            values={{
              field: <FormattedMessage id={`${field}`} />
            }}
          />
        )
      };
    };

    public render() {
      const { ...restProps } = this.props as {};
      return (
        <WrappedComponent
          {...restProps}
          requiredRule={this.fieldRequiredRule}
        />
      );
    }
  };
};

export default withReqiredRule;
