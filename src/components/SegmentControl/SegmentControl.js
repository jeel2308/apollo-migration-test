/**--external-- */
import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import _map from 'lodash/map';

/**--relative-- */
import classes from './SegmentControl.module.scss';

const SegmentControl = (props) => {
  const { options, onOptionClick, activeValue } = props;

  return (
    <ButtonGroup spacing={1} flex={1} className={classes.container}>
      {_map(options, (option, index) => {
        const { label, value } = option;

        const backgroundColor = value === activeValue ? 'purple.500' : 'white';

        const color = value === activeValue ? 'white' : 'black';

        return (
          <Button
            isFullWidth
            key={value}
            onClick={() => onOptionClick(option)}
            color={color}
            backgroundColor={backgroundColor}
            _hover={{ backgroundColor }}
          >
            {label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default SegmentControl;
