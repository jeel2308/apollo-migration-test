/**--external-- */
import React from 'react';
import { Tooltip } from '@chakra-ui/react';

/**--relative-- */
import classes from './withTooltip.module.scss';
const withTooltip = (WrappedComponent) => {
  const WithTooltip = (props) => {
    const { tooltipLabel, tooltipPlacement = 'bottom', ...otherProps } = props;

    return (
      <Tooltip label={tooltipLabel} placement={tooltipPlacement} hasArrow>
        {/**Tooltip expects span as top level element
         * when WrappedComponent is string type component(like button,div etc)*/}
        <span className={classes.container}>
          <WrappedComponent {...otherProps} />
        </span>
      </Tooltip>
    );
  };

  WithTooltip.displayName = `WithTooltip-${WrappedComponent.displayName}`;
  return WithTooltip;
};

export default withTooltip;
