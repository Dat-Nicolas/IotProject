import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/constants';

type AuthAwareState = {
  auth: {
    token: string | null;
  };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AuthAwareState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Room', 'AC', 'Config', 'Dashboard', 'Logs', 'User', 'AdminAC', 'Brand', 'Schedule'],
  endpoints: () => ({}),
});
