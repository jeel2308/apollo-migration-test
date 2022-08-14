/**--external-- */
import React, { useRef, useState } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiSearch, BiX } from 'react-icons/bi';

/**--relative-- */
import { iconStyle, inputStyle, inputAddonStyle } from './SearchBarStyles';

const SearchBar = (props) => {
  const { onChange } = props;

  const inputRef = useRef();

  const [searchText, setSearchText] = useState('');

  const updateSearchText = (value) => {
    setSearchText(value);
    onChange(value);
  };

  const onCloseIconClick = () => {
    updateSearchText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onInputChange = (e) => {
    updateSearchText(e.target.value);
  };

  return (
    <InputGroup size="md" borderRadius="8px" padding={1}>
      <InputLeftElement pointerEvents="none" style={inputAddonStyle}>
        <IconContext.Provider value={iconStyle}>
          <BiSearch />
        </IconContext.Provider>
      </InputLeftElement>
      <Input
        value={searchText}
        onChange={onInputChange}
        style={inputStyle}
        ref={inputRef}
        placeholder="Search links by title or url"
      />
      <InputRightElement
        style={inputAddonStyle}
        onClick={onCloseIconClick}
        cursor="pointer"
      >
        <IconContext.Provider value={iconStyle}>
          <BiX />
        </IconContext.Provider>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;

SearchBar.displayName = 'SearchBar';
