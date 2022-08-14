/**--external-- */
import React, { useState, useEffect } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Heading, Text } from '@chakra-ui/react';
import _noop from 'lodash/noop';

/**--internal-- */
import { Dropdown } from '#components';

/**--relative-- */
import classes from './Link.module.scss';
import { dotsStyle } from './LinkStyles';

const Metadata = (props) => {
  const { title, description, thumbnail, onMetadataLoaded } = props;

  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(() => !!thumbnail);

  useEffect(() => {
    if (!isImageLoading) {
      onMetadataLoaded();
    }
  }, [isImageLoading]);

  const onImageLoadError = () => {
    setShowThumbnail(false);
    setIsImageLoading(false);
  };

  const onImageLoad = () => {
    setShowThumbnail(true);
    setIsImageLoading(false);
  };

  return (
    <div className={classes.linkMetadataContainer}>
      {title && (
        <Heading as="h5" size={'md'}>
          {title}
        </Heading>
      )}
      {description && (
        <Text fontSize={'sm'} colorScheme="blackAlpha">
          {description}
        </Text>
      )}
      <figure
        className={classes.thumbnail}
        style={{ display: !showThumbnail ? 'none' : 'initial' }}
      >
        <img
          src={thumbnail}
          alt={title}
          onError={onImageLoadError}
          onLoad={onImageLoad}
        />
      </figure>
    </div>
  );
};

const Link = (props) => {
  const {
    url,
    dropDownOptions,
    title,
    thumbnail,
    description,
    id,
    onLinkClick,
    onMetadataLoaded,
  } = props;

  const handleActions = ({ value }) => {
    props.handleActions({ value, linkId: id });
  };

  const showMetadata = title || thumbnail || description;

  return (
    <div className={classes.container} onClick={onLinkClick}>
      <div className={classes.firstRow}>
        <Text className={classes.link}>{url}</Text>

        <div className={classes.dropDownContainer}>
          <Dropdown
            variant="unstyled"
            options={dropDownOptions}
            dropdownButtonType="icon"
            handleActions={handleActions}
            icon={
              <IconContext.Provider value={dotsStyle}>
                <BiDotsVerticalRounded />
              </IconContext.Provider>
            }
          />
        </div>
      </div>
      {showMetadata && (
        <Metadata
          title={title}
          description={description}
          thumbnail={thumbnail}
          onMetadataLoaded={onMetadataLoaded}
        />
      )}
    </div>
  );
};

Link.displayName = 'Link';

Link.defaultProps = {
  onMetadataLoaded: _noop,
};

export default Link;
