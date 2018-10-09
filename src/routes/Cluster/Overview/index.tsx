import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';
import withCapitalize from '@/containers/withCapitalize';

const CapitalizedMessage = withCapitalize(FormattedMessage);
class Overview extends React.Component<
  object & InjectedAuthRouterProps,
  object
> {
  public render() {
    return (
      <div>
        <h1>
          <CapitalizedMessage id="overview" />
        </h1>
      </div>
    );
  }
}

export default Overview;
