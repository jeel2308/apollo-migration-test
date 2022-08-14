/**--external-- */
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { setToastMessage } from '../../modules/Module';
const ToastMessage = (props) => {
  const { toastMessage, setToastMessage } = props;
  const setToast = useToast();

  useEffect(() => {
    if (!_isEmpty(toastMessage)) {
      setToast(toastMessage);
      setToastMessage({});
    }
  }, [toastMessage]);

  return null;
};

const mapStateToProps = (state) => {
  return { toastMessage: state.toastMessage };
};

const mapActionCreators = {
  setToastMessage,
};

export default connect(mapStateToProps, mapActionCreators)(ToastMessage);
