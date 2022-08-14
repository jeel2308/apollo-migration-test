/**--external-- */
import { useRef, useEffect } from 'react';
import propTypes from 'prop-types';

const ScrollIntoViewWrapper = (props) => {
  const { dependencyForChangingScrollPosition, children } = props;

  const childrenRef = useRef(null);

  const scrollIntoView = () => {
    childrenRef.current &&
      childrenRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollIntoView();
  }, dependencyForChangingScrollPosition);

  return children({ ref: childrenRef, scrollIntoView });

  // return React.cloneElement(children, {
  //   ref: updateRefs,
  //   scrollIntoView,
  // });
};

export default ScrollIntoViewWrapper;

ScrollIntoViewWrapper.displayName = 'ScrollIntoViewWrapper';

ScrollIntoViewWrapper.propTypes = {
  dependencyForChangingScrollPosition: propTypes.array,
};
