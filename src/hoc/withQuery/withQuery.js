/**--external-- */
import React from 'react';
import { useQuery } from '@apollo/client';

const withQuery = (query, config) => (WrappedComponent) => {
  const {
    options,
    props: mapQueryToProps,
    skip = false,
    name,
    alias = 'withQuery',
    updateQuery,
  } = config;

  const WithQuery = (props) => {
    const shouldSkip = typeof skip === 'function' ? skip(props) : skip;

    const queryObject = useQuery(query, {
      ...(typeof options === 'function' ? options(props) : options),
      skip: shouldSkip,
      name,
      updateQuery,
    });

    const updatedProps = mapQueryToProps({
      [name]: queryObject,
      ownProps: props,
    });
    return <WrappedComponent {...props} {...updatedProps} />;
  };

  WithQuery.displayName = `${alias}-${WrappedComponent.displayName}`;

  return WithQuery;
};

export default withQuery;
