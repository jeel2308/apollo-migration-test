/**--external-- */
import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
} from '@chakra-ui/react';
import _map from 'lodash/map';
import PropTypes from 'prop-types';

const Dropdown = (props) => {
  const {
    variant,
    buttonLabel,
    icon,
    dropdownButtonType,
    options,
    handleActions,
  } = props;

  const onMenuButtonClick = (e) => {
    e.stopPropagation();
  };

  const getDropdownButtonVariant = () => {
    switch (dropdownButtonType) {
      case 'button': {
        return Button;
      }
      case 'icon': {
        return IconButton;
      }
    }
  };

  const getDropdownButtonProps = () => {
    switch (dropdownButtonType) {
      case 'button': {
        return { label: buttonLabel };
      }
      case 'icon': {
        return { icon };
      }
    }
  };

  return (
    <Menu>
      <MenuButton
        onClick={onMenuButtonClick}
        as={getDropdownButtonVariant()}
        aria-label="actions"
        display="flex"
        {...getDropdownButtonProps()}
        variant={variant}
      />
      <MenuList zIndex="5">
        {_map(options, (option) => {
          const { label, value } = option;
          const onClick = (e) => {
            e.preventDefault();
            handleActions(option);
          };
          return (
            <MenuItem key={value} onClick={onClick}>
              {label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

Dropdown.defaultProps = {
  variant: 'button',
};

Dropdown.propTypes = {
  variant: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  icon: PropTypes.element,
  dropdownButtonType: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleActions: PropTypes.func.isRequired,
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
