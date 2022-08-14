/**--external-- */
import React from 'react';
import { Spinner } from '@chakra-ui/react';

/**--relative-- */
import classes from './withLoader.module.scss';

const withLoader = (WrappedComponent) => {
  const GraphqlLoader = (props) => {
    const { isData, isLoading, loadingContainerStyle = {} } = props;

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

    return <WrappedComponent {...props} />;
  };

  return GraphqlLoader;
};

export default withLoader;
