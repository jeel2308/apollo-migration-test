/**--external-- */
import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Spinner } from '@chakra-ui/react';

/**--internal-- */
import classes from './FullScreenLoader.module.scss';

const FullScreenLoader = () => {
  const portalNode = document.getElementById('loader');

  const loaderContainerRef = useRef(document.createElement('div'));

  useEffect(() => {
    const loaderContainer = loaderContainerRef.current;
    portalNode.appendChild(loaderContainer);
    return () => portalNode.removeChild(loaderContainer);
  }, []);

  const element = (
    <div className={classes.container}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </div>
  );
  return createPortal(element, loaderContainerRef.current);
};

FullScreenLoader.displayName = 'FullScreenLoader';

export default FullScreenLoader;
