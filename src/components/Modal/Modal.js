/**--external-- */
import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**--relative-- */
import classes from './Modal.module.scss';
const Modal = ({ children, onClickOutside }) => {
  const portalNode = document.getElementById('portal');

  const modalParentNodeRef = useRef(document.createElement('div'));

  const onOverlayClick = useCallback((e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    onClickOutside?.();
  }, []);

  useEffect(() => {
    const modalParentNode = modalParentNodeRef.current;
    portalNode.appendChild(modalParentNode);
    return () => portalNode.removeChild(modalParentNode);
  }, []);

  const contentElement = (
    <div className={classes.overlay} onClick={onOverlayClick}>
      {children}
    </div>
  );

  return createPortal(contentElement, modalParentNodeRef.current);
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.element,
};

Modal.displayName = 'Modal';
