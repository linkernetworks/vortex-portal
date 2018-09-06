import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

class Overview extends React.Component<object & InjectedAuthRouterProps> {
  public render() {
    return (
      <div>
        <h1>
          <FormattedMessage id="overview" />
        </h1>
      </div>
    );
  }
}

export default Overview;
