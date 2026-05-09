import { baseApi } from './baseApi';

interface AuthPayload {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'USER';
  };
}

interface RawAuthPayload {
  token?: string;
  access_token?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'USER';
  };
}

const normalizeAuthPayload = (payload: RawAuthPayload): AuthPayload => {
  const token = payload.token ?? payload.access_token;

  if (!token) {
    throw new Error('Auth token is missing in server response');
  }

  return {
    token,
    user: payload.user,
  };
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthPayload, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: RawAuthPayload }) => normalizeAuthPayload(response.data),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<
      AuthPayload,
      { fullName: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: RawAuthPayload }) => normalizeAuthPayload(response.data),
      invalidatesTags: ['Auth'],
    }),
    profile: builder.query<AuthPayload['user'], void>({
      query: () => '/auth/profile',
      transformResponse: (response: { data: AuthPayload['user'] }) => response.data,
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useProfileQuery } = authApi;
