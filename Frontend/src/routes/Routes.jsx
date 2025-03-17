import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  // Import PropTypes for validation

export const PublicRoute = ({ component: Component }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? <Navigate to="/overview/tasks" /> : <Component />;
};

PublicRoute.propTypes = {
    component: PropTypes.elementType.isRequired,  // Ensures that 'component' is a valid React component
};

export const ProtectedRoute = ({ component: Component }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,  // Ensures that 'component' is a valid React component
};
