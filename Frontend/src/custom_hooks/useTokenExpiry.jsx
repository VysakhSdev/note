// useTokenExpiry.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doLogout,parseJwt} from '../redux/features/authSlice';

const useTokenExpiry = (accessToken) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const handleTokenExpiration = () => {
      alert('Your session has expired. Please log in again.');
      dispatch(doLogout());
      navigate('/login');
    };

    if (accessToken) {
      const decodedToken = parseJwt(accessToken);
      if (decodedToken?.exp) {
        const expirationTime = decodedToken.exp * 1000 - Date.now();
        if (expirationTime > 0) {
          timeoutId = setTimeout(handleTokenExpiration, expirationTime);
        } else {
          // Token already expired
          handleTokenExpiration();
        }
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [accessToken, dispatch, navigate]);
};

export default useTokenExpiry;
