import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../components/common/Loading';
import { setAuth } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { APP_STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuthState = async () => {
      try {
        const [persistedToken, persistedUser] = await Promise.all([
          storage.get<string>(APP_STORAGE_KEYS.token),
          storage.get<RootState['auth']['user']>(APP_STORAGE_KEYS.user),
        ]);

        if (isMounted && persistedToken && persistedUser) {
          dispatch(
            setAuth({
              token: persistedToken,
              user: persistedUser,
            }),
          );
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    void hydrateAuthState();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistAuthState = async () => {
      if (token && user) {
        await Promise.all([
          storage.set(APP_STORAGE_KEYS.token, token),
          storage.set(APP_STORAGE_KEYS.user, user),
        ]);
        return;
      }

      await Promise.all([
        storage.remove(APP_STORAGE_KEYS.token),
        storage.remove(APP_STORAGE_KEYS.user),
      ]);
    };

    void persistAuthState();
  }, [isHydrated, token, user]);

  if (!isHydrated) {
    return <Loading />;
  }

  if (!token) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}
