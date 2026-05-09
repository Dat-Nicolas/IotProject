import { baseApi } from './baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ACStatus = 'ON' | 'OFF';
export type ACMode = 'COOL' | 'DRY' | 'FAN' | 'AUTO';

export interface BrandRef {
  id: string;
  name: string;
  irProtocol?: string;
}

export interface RoomRef {
  id: string;
  name: string;
  location?: string;
}

export interface ACFullResponse {
  id: string;
  name: string;
  status: ACStatus;
  mode: ACMode;
  currentTemp: number;
  brandId: string;
  roomId: string;
  brand: BrandRef;
  room: RoomRef;
  createdAt: string;
  updatedAt: string;
}

export interface CreateACPayload {
  name: string;
  brandId: string;
  roomId: string;
  currentTemp?: number;
  mode?: ACMode;
}

export interface UpdateACPayload {
  name?: string;
  brandId?: string;
  roomId?: string;
  status?: ACStatus;
  mode?: ACMode;
  currentTemp?: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminAcApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllACs: builder.query<ACFullResponse[], { roomId?: string } | void>({
      query: (params) => {
        const q = params && params.roomId ? `?roomId=${params.roomId}` : '';
        return `/air-conditioners${q}`;
      },
      transformResponse: (response: { data: ACFullResponse[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AdminAC' as const, id })),
              { type: 'AdminAC', id: 'LIST' },
            ]
          : [{ type: 'AdminAC', id: 'LIST' }],
    }),

    getACById: builder.query<ACFullResponse, string>({
      query: (id) => `/air-conditioners/${id}`,
      transformResponse: (response: { data: ACFullResponse }) => response.data,
      providesTags: (_result, _err, id) => [{ type: 'AdminAC', id }],
    }),

    createAC: builder.mutation<ACFullResponse, CreateACPayload>({
      query: (body) => ({
        url: '/air-conditioners',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: ACFullResponse }) => response.data,
      invalidatesTags: [{ type: 'AdminAC', id: 'LIST' }, 'AC'],
    }),

    updateAC: builder.mutation<ACFullResponse, { id: string; data: UpdateACPayload }>({
      query: ({ id, data }) => ({
        url: `/air-conditioners/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: ACFullResponse }) => response.data,
      invalidatesTags: (_result, _err, { id }) => [{ type: 'AdminAC', id }, 'AC'],
    }),

    deleteAC: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/air-conditioners/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { id: string } }) => response.data,
      invalidatesTags: (_result, _err, id) => [
        { type: 'AdminAC', id },
        { type: 'AdminAC', id: 'LIST' },
        'AC',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllACsQuery,
  useGetACByIdQuery,
  useCreateACMutation,
  useUpdateACMutation,
  useDeleteACMutation,
} = adminAcApi;
