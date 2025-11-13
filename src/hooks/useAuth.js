import { useAuthContext } from '../state/AuthContext';

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
