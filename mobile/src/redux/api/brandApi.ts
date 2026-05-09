import { baseApi } from './baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrandResponse {
  id: string;
  name: string;
  irProtocol?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandPayload {
  name: string;
  irProtocol?: string;
}

export interface UpdateBrandPayload {
  name?: string;
  irProtocol?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandResponse[], void>({
      query: () => '/brands',
      transformResponse: (response: { data: BrandResponse[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Brand' as const, id })),
              { type: 'Brand', id: 'LIST' },
            ]
          : [{ type: 'Brand', id: 'LIST' }],
    }),

    getBrandById: builder.query<BrandResponse, string>({
      query: (id) => `/brands/${id}`,
      transformResponse: (response: { data: BrandResponse }) => response.data,
      providesTags: (_result, _err, id) => [{ type: 'Brand', id }],
    }),

    createBrand: builder.mutation<BrandResponse, CreateBrandPayload>({
      query: (body) => ({
        url: '/brands',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: BrandResponse }) => response.data,
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    updateBrand: builder.mutation<BrandResponse, { id: string; data: UpdateBrandPayload }>({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: BrandResponse }) => response.data,
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Brand', id }],
    }),

    deleteBrand: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { id: string } }) => response.data,
      invalidatesTags: (_result, _err, id) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
