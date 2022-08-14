/**--external-- */
import { useLocation, useParams } from 'react-router-dom';

const withRouter = (WrappedComponent) => {
  const WithRouter = (props) => {
    const location = useLocation();
    const params = useParams();

    return <WrappedComponent {...props} {...location} {...params} />;
  };
  WithRouter.displayName = 'WithRouter';
  return WithRouter;
};

export default withRouter;
