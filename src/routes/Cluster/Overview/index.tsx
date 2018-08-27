import * as React from 'react';
import { InjectedAuthRouterProps } from 'redux-auth-wrapper/history4/redirect';

class Overview extends React.Component<
  object & InjectedAuthRouterProps,
  object
> {
  public render() {
    return (
      <div>
        <h1>Overview</h1>
      </div>
    );
  }
}

export default Overview;
