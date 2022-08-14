/**--external-- */
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { Spinner } from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { setToastMessage } from '../../modules/Module';

/**--relative-- */
import classes from './withQuery.module.scss';

const withQuery = (query, configuration) => (WrappedComponent) => {
  const WithQuery = (props) => {
    const { setToastMessage, ...otherProps } = props;

    const {
      name,
      fetchPolicy,
      getVariables,
      getSkipQueryStatus,
      mapQueryDataToProps,
      updateQuery,
      loadingContainerStyle,
    } = configuration;

    const variables = getVariables(otherProps);

    const skip = getSkipQueryStatus?.(otherProps) ?? false;

    const queryObject = useQuery(query, {
      fetchPolicy: fetchPolicy ?? 'cache-and-network',
      skip,
      variables,
      updateQuery,
      /**
       * This is required to detect different network status.
       * Specially, network status 3 won't be detected without it
       */
      notifyOnNetworkStatusChange: true,
    });

    const { error } = queryObject;

    useEffect(() => {
      if (error) {
        setToastMessage({
          title: 'Something went wrong',
          isClosable: true,
          position: 'bottom-left',
          status: 'error',
        });
      }
    }, [error]);

    const { isData, isLoading, ...otherQueryDataProps } = mapQueryDataToProps({
      [name ? name : 'queryObject']: queryObject,
      ownProps: otherProps,
    });

    if (!isData && isLoading) {
      return (
        <div className={classes.container} style={loadingContainerStyle}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      );
    }
    if (error) {
      return null;
    }
    return <WrappedComponent {...otherProps} {...otherQueryDataProps} />;
  };

  const mapActionCreators = {
    setToastMessage,
  };

  WithQuery.displayName = configuration.displayName;

  return connect(null, mapActionCreators)(WithQuery);
};

export default withQuery;
