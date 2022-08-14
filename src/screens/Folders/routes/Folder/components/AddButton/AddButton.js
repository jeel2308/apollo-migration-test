/**--external-- */
import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { BiPlus } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--internal-- */
import { addButtonStyle } from './AddButtonStyles';

const AddButton = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="add link"
      colorScheme="teal"
      onClick={onClick}
      borderRadius="50%"
    >
      <IconContext.Provider value={addButtonStyle}>
        <BiPlus />
      </IconContext.Provider>
    </IconButton>
  );
};

export default AddButton;
