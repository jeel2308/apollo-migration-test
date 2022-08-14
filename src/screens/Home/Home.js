/**--external-- */
import React from 'react';
import {
  Heading,
  UnorderedList,
  ListItem,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**--relative-- */
import classes from './Home.module.scss';
import { buttonGroupStyles } from './HomeStyles';
import {
  TITLE_ELEMENT,
  TITLE_FONT_SIZE,
  LIST_FONT_SIZE,
  LIST_ITEM_ELEMENT,
} from './utils';

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <ButtonGroup spacing={'6'} style={buttonGroupStyles}>
          <Link to={'register'}>
            <Button colorScheme={'blue'}>Sign up</Button>
          </Link>
          <Link to={'login'}>
            <Button colorScheme={'blue'}>Sign in</Button>
          </Link>
        </ButtonGroup>
        <div className={classes.heroContainer}>
          <Heading as={TITLE_ELEMENT} size={TITLE_FONT_SIZE}>
            LinkManagement: One place to keep all links
          </Heading>
          <UnorderedList mt={'6'}>
            <ListItem>
              <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE}>
                Manage links easily
              </Heading>
            </ListItem>
            <ListItem>
              <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE} mt={'2'}>
                Group links by subject
              </Heading>
            </ListItem>
            <ListItem>
              <Heading as={LIST_ITEM_ELEMENT} size={LIST_FONT_SIZE} mt={'2'}>
                Track link status
              </Heading>
            </ListItem>
          </UnorderedList>
        </div>
      </div>
    </div>
  );
};

export default Home;

Home.displayName = 'Home';
