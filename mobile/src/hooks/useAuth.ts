import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState, AppDispatch } from '../redux/store';
import { clearAuth } from '../redux/slices/authSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  return useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      logout: () => dispatch(clearAuth()),
    }),
    [auth, dispatch],
  );
};
