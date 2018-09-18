import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Subtract } from '@/utils/types';

export interface InjectedProps {
  uniqueRule: (
    usedValues: Array<string>
  ) => {
    validator: (_: any, value: string, callback: any) => any;
  };
}

const withUniqueRule = <WrappedProps extends InjectedProps>(
  WrappedComponent: React.ComponentType<WrappedProps>
) => {
  // These props will be added to original component type
  type HocProps = Subtract<WrappedProps, InjectedProps>;

  return class extends React.PureComponent<HocProps, object> {
    // Enhance component name for debugging and React-Dev-Tools
    public static displayName = `withUniqueRule(${WrappedComponent})`;

    protected fieldUniqueRule = (usedValues: Array<string>) => {
      return {
        validator: (_: any, value: string, callback: any) => {
          let isUsed = false;
          for (const used of usedValues) {
            if (used === value) {
              isUsed = true;
              break;
            }
          }
          isUsed
            ? callback(
                <FormattedMessage
                  id="form.message.unique"
                  values={{
                    value
                  }}
                />
              )
            : callback();
        }
      };
    };

    public render() {
      const { ...restProps } = this.props as {};
      return (
        <WrappedComponent {...restProps} uniqueRule={this.fieldUniqueRule} />
      );
    }
  };
};

export default withUniqueRule;
