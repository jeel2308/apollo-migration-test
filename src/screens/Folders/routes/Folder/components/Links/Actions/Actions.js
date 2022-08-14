/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import _map from 'lodash/map';

/**--relative-- */
import classes from './Actions.module.scss';

const Actions = (props) => {
  const { allowedBulkActions, onActionClick } = props;
  return (
    <div className={classes.container}>
      {_map(
        allowedBulkActions,
        ({ value, label, disabled = false, variant, colorScheme, style }) => {
          return (
            <Button
              key={value}
              disabled={disabled}
              variant={variant}
              colorScheme={colorScheme}
              style={style}
              onClick={() => onActionClick({ type: value })}
            >
              {label}
            </Button>
          );
        }
      )}
    </div>
  );
};

export default Actions;

Actions.displayName = 'Actions';
