import * as React from 'react';

const withCapitalize = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    return (
      <span style={{ textTransform: 'capitalize' }}>
        <WrappedComponent {...props} />
      </span>
    );
  };
};

export default withCapitalize;
