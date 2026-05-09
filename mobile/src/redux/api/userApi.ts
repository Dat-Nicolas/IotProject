import { baseApi } from './baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'USER';

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse[], void>({
      query: () => '/users',
      transformResponse: (response: { data: UserResponse[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: { data: UserResponse }) => response.data,
      providesTags: (_result, _err, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserResponse, CreateUserPayload>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: UserResponse }) => response.data,
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: UserResponse }) => response.data,
      invalidatesTags: (_result, _err, { id }) => [{ type: 'User', id }],
    }),

    deleteUser: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { id: string } }) => response.data,
      invalidatesTags: (_result, _err, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
